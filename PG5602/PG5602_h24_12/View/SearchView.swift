//
//  SearchView.swift
//  PG5602_h24_12
//
//
//

import SwiftData
import SwiftUI

struct SearchView: View {
  @Environment(\.modelContext) private var context
  @State private var searches: [Search] = []
  @State private var articles: [JsonArticle] = []
  @State private var showSheet = false
  @State private var keyword = ""
  @State private var isSortingByDate = false
  
  // fetch recent searches
  private func getSearches() {
    var fetch: FetchDescriptor<Search>
    let sort = SortDescriptor(\Search.created, order: .reverse)
    fetch = FetchDescriptor<Search>(sortBy: [sort])
    fetch.propertiesToFetch = [\.title]
    fetch.fetchLimit = 5

    do {
      searches = try context.fetch(fetch)
    } catch {
      print("Error: \(error.localizedDescription)")
    }
  }

  // save search word
  // should look into not saving duplicates
  func saveSearch(keyword: String) {
    let search = Search()
    search.title = keyword
    context.insert(search)
    do {
      try context.save()
    } catch {
      print("Error: \(error.localizedDescription)")
    }
  }

  // sort articles by published date
  private func sortArticlesByDate(_ articles: [JsonArticle]) -> [JsonArticle] {
    articles.sorted { article1, article2 in
      guard
        let date1 = ISO8601DateFormatter().date(from: article1.publishedAt),
        let date2 = ISO8601DateFormatter().date(from: article2.publishedAt)
      else {
        return false
      }
      return date1 > date2
    }
  }
 
  // save article to database
  private func saveArticle(_ jsonArticle: JsonArticle) {
    let newArticle = Article(
      title: jsonArticle.title,
      subtitle: jsonArticle.description ?? ""
    )
    newArticle.source = jsonArticle.source.name
    newArticle.author = jsonArticle.author
    newArticle.publishedAt = ISO8601DateFormatter().date(from: jsonArticle.publishedAt)
    newArticle.url = URL(string: jsonArticle.url)
    newArticle.urlToImage = URL(string: jsonArticle.urlToImage ?? "")
    newArticle.content = jsonArticle.content
    newArticle.created = Date.now
    newArticle.updated = Date.now
    
    context.insert(newArticle)
    
    do {
      try context.save()
      print("Article saved successfully")
    } catch {
      print("Error saving article: \(error.localizedDescription)")
    }
  }

  private var filteredArticles: [JsonArticle] {
    isSortingByDate ? sortArticlesByDate(articles) : articles
  }
  
  // delete all search history
  private func deleteSearchHistory() {
    let fetch: FetchDescriptor<Search> = FetchDescriptor<Search>()
    do {
      let allSearches = try context.fetch(fetch)
      for search in allSearches {
        context.delete(search)
      }
      try context.save()
      searches = []
      print("Search history deleted successfully")
    } catch {
      print("Error deleting search history: \(error.localizedDescription)")
    }
  }

  var body: some View {
    NavigationStack {
      VStack {
        if filteredArticles.isEmpty {
          ContentUnavailableView("No articles match your search.", systemImage: "magnifyingglass")
        } else {
          List(filteredArticles, id: \.self) { article in
            VStack(alignment: .leading, spacing: 5) {
              NavigationLink(destination: ArticleDetailView(
                title: article.title,
                description: article.description,
                imageUrl: article.urlToImage,
                content: article.content,
                author: article.author,
                url: URL(string: article.url),
                isSaved: false,
                onSave: nil,
                onDelete: nil
              )) {
                VStack(alignment: .leading) {
                  Text(article.title)
                    .fontWeight(.semibold)
                  Text(article.description ?? "")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                }
              }
            }
          }
        }
      }
      .navigationTitle("Search")
      .toolbar {
        ToolbarItem(placement: .topBarTrailing) {
          Menu {
            Button(action: {
              isSortingByDate.toggle()
            }) {
              Text(isSortingByDate ? "Remove Date Filter" : "Sort by Date")
            }
          } label: {
            Image(systemName: "ellipsis.circle")
          }
        }
        ToolbarItem(placement: .topBarTrailing) {
          Button {
            showSheet.toggle()
          } label: {
            Image(systemName: "magnifyingglass.circle.fill")
          }
        }
      }
      .sheet(isPresented: $showSheet) {
        List {
          TextField("Keywords or phrases to search for", text: $keyword)
            .textFieldStyle(.roundedBorder)
          ScrollView(.horizontal, showsIndicators: false) {
            HStack {
              ForEach(searches) { search in
                Button(search.title) {
                  keyword = search.title
                }
                .buttonStyle(.borderless)
                .font(.footnote)
              }
            }
          }
          .onAppear {
            getSearches()
          }
          HStack {
            Button("Search") {
              Task {
                articles = await getJsonArticles(keyword: keyword)
              }
              saveSearch(keyword: keyword)
              showSheet.toggle()
            }
            .disabled(keyword.isEmpty)
            Button("Delete search history") {
              deleteSearchHistory()
            }
            .disabled(searches.isEmpty)
          }
          .buttonStyle(.borderedProminent)
        }
        .presentationDetents([.height(200), .height(300)])
        .presentationCornerRadius(20)
        .listStyle(.plain)
        .padding(.top, 20)
      }
    }
  }
}
