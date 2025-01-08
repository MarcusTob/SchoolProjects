//
//  HomeView.swift
//  PG5602_h24_12
//
//
//

import SwiftUI
import SwiftData

struct HomeView: View {
  @Query(sort: \Category.title, order: .forward) private var categories: [Category]
  @Query(filter: #Predicate<Country> { $0.favorite == true }) private var favoriteCountries: [Country]
  @Environment(\.modelContext) private var context
  @State private var selectedCategory: Category?
  @State private var articles: [Article] = []
  @State private var topHeadlines: [JsonArticle] = []
  @State private var selectedHeadline: JsonArticle?
  @State private var noHeadlinesMessage: String?
  @AppStorage("isNewsTickerEnabled") private var isNewsTickerEnabled: Bool = true
  @AppStorage("tickerPosition") private var tickerPosition: String = "Top"
  
  // Fetch articles based on category
  private func getArticles() {
    let sort = SortDescriptor(\Article.title, order: .forward)
    let fetch: FetchDescriptor<Article>
    if let category = selectedCategory {
      let id = category.id
      let predicate = #Predicate<Article> { article in article.category?.id == id }
      fetch = FetchDescriptor<Article>(predicate: predicate, sortBy: [sort])
    } else {
      fetch = FetchDescriptor<Article>(sortBy: [sort])
    }

    do {
      articles = try context.fetch(fetch)
    } catch {
      print("Error fetching articles: \(error.localizedDescription)")
    }
  }

  // Fetch top headlines based on favorite country
  private func fetchTopHeadlines() async {
    // Get the first favorited country or default to "us"
    let favoriteCountry = favoriteCountries.first?.iso ?? "us"
    // Get the first favorited category or default to `.all`
    let favoriteCategory = categories.first(where: { $0.favorite })?.title ?? "all"
      
    let jsonCategory = JsonCategory(rawValue: favoriteCategory.lowercased()) ?? .all

    print("Fetching headlines for country: \(favoriteCountry) and category: \(jsonCategory.rawValue)")

    // Fetch headlines based on both country and category
    let headlines = await getTopHeadlines(country: favoriteCountry, category: jsonCategory)

    DispatchQueue.main.async {
      if headlines.isEmpty {
        noHeadlinesMessage = "No top headlines available for this country and category."
      } else {
        topHeadlines = headlines
      }
    }
  }

  // Delete article from the database
  private func deleteArticle(at offsets: IndexSet) {
    for index in offsets {
      let article = articles[index]
      context.delete(article)
    }

    do {
      try context.save()
      getArticles() // Refresh articles list
    } catch {
      print("Error deleting article: \(error.localizedDescription)")
    }
  }
  
  @ViewBuilder
  private func renderNewsTicker() -> some View {
      if isNewsTickerEnabled, !topHeadlines.isEmpty {
          NewsTickerView(headlines: topHeadlines.map { $0.title })
      } else if isNewsTickerEnabled, let message = noHeadlinesMessage {
          Text(message)
              .font(.headline)
              .foregroundColor(.gray)
              .padding()
      }
  }
  
  @ViewBuilder
  private func navigationLink(for article: Article) -> some View {
    NavigationLink(
      destination: ArticleDetailView(
        title: article.title,
        description: article.subtitle,
        imageUrl: article.urlToImage?.absoluteString,
        content: article.content,
        author: article.author,
        url: article.url,
        isSaved: true,
        onSave: nil,
        onDelete: {
          context.delete(article)
          do {
            try context.save()
            getArticles()
          } catch {
            print("Error deleting article: \(error.localizedDescription)")
          }
        }
      )
    ) {
      VStack(alignment: .leading) {
        Text(article.title)
          .fontWeight(.semibold)
        Text(article.category?.title ?? "No Category")
      }
    }
  }


  var body: some View {
    NavigationStack {
      VStack {
        if tickerPosition == "Top" {
            renderNewsTicker()
        }
        // Article List Section
        Group {
          if articles.isEmpty {
            ContentUnavailableView("No articles have been saved yet.", systemImage: "square.stack.3d.up.slash")
          } else {
            List {
              ForEach(articles) { article in
                navigationLink(for: article)
              }
              .onDelete(perform: deleteArticle)
            }
          }
          if tickerPosition == "Bottom" {
            renderNewsTicker()
          }
        }
        .onAppear {
          getArticles()
        }
      }
      .onAppear {
        Task {
          await fetchTopHeadlines()
        }
      }
      .sheet(item: $selectedHeadline) { headline in
        ArticleDetailView(
          title: headline.title,
          description: headline.description,
          imageUrl: headline.urlToImage,
          content: headline.content,
          author: headline.author,
          url: URL(string: headline.url),
          isSaved: false,
          onSave: nil,
          onDelete: nil
        )
      }
      .toolbar {
        ToolbarItem(placement: .topBarLeading) {
          Menu {
            Button("All categories") {
              selectedCategory = nil
              getArticles()
            }
            ForEach(categories) { category in
              Button {
                selectedCategory = category
                getArticles()
              } label: {
                Text(category.title)
              }
            }
          } label: {
            Image(systemName: "tray.full.fill")
          }
        }
      }
    }
  }
}
