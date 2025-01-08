//
//  ArticleDetailView.swift
//  PG5602_h24_12
//
//
//

import SwiftUI
import SwiftData

struct ArticleDetailView: View {
  let title: String
  let description: String?
  let imageUrl: String?
  let content: String?
  let author: String?
  let url: URL?
  let isSaved: Bool
  let onSave: (() -> Void)?
  let onDelete: (() -> Void)?
  @Environment(\.modelContext) private var context
  @Query(sort: \Category.title, order: .forward) private var categories: [Category]
  @State private var isCategorySelectorVisible = false
  
  func showPopup(message: String) {
    let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
    alert.addAction(UIAlertAction(title: "OK", style: .default))
    
    if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
       let rootViewController = windowScene.windows.first?.rootViewController {
      rootViewController.present(alert, animated: true, completion: nil)
    }
  }
  
  private func assignToCategory(_ category: Category) {
    let fetch = FetchDescriptor<Article>(predicate: #Predicate<Article> { $0.title == title })
    do {
      if let existingArticle = try context.fetch(fetch).first {
        existingArticle.category = category
      } else {
        let newArticle = Article(title: title, subtitle: description ?? "")
        newArticle.content = content
        newArticle.urlToImage = URL(string: imageUrl ?? "")
        newArticle.url = url
        newArticle.category = category
        newArticle.author = author
        context.insert(newArticle)
      }
      try context.save()
      showPopup(message: "Article assigned to \(category.title)")
    } catch {
      print("Failed to assign category: \(error.localizedDescription)")
    }
  }
  
  var body: some View {
    ScrollView {
      VStack(alignment: .leading) {
        Text(title)
          .font(.largeTitle)
          .fontWeight(.bold)
          .padding()
        
        if let imageUrl = imageUrl, let url = URL(string: imageUrl) {
          AsyncImage(url: url) { image in
            image.resizable().scaledToFit()
          } placeholder: {
            ProgressView()
          }
          .frame(maxHeight: 250)
          .padding()
        }
        if let author = author {
            Text("By \(author)")
                .font(.subheadline)
                .foregroundColor(.gray)
                .padding(.horizontal)
        }
        if let description = description {
          Text(description)
            .font(.headline)
            .padding([.horizontal, .bottom])
        }
        
        if let content = content {
          Text(content)
            .font(.body)
            .padding([.horizontal, .bottom])
        }
        if let articleUrl = url {
          Link(destination: articleUrl) {
            Text("Read Full Article")
              .font(.headline)
              .foregroundColor(.blue)
              .padding()
              .frame(maxWidth: .infinity, alignment: .center)
            }
        }
      }
    }
    .navigationTitle("Article Details")
    .navigationBarTitleDisplayMode(.inline)
    .toolbar {
      if let onDelete = onDelete, isSaved {
        ToolbarItem(placement: .navigationBarTrailing) {
          Button(action: {
            onDelete()
            showPopup(message: "Article Deleted")
          }) {
            Image(systemName: "trash")
              .accessibilityLabel("Remove Article")
              .foregroundColor(.red)
          }
        }
      }
      // Assign to Category button
      ToolbarItem(placement: .navigationBarTrailing) {
        Button(action: {
          isCategorySelectorVisible = true
        }) {
          Image(systemName: "bookmark")
            .accessibilityLabel("Assign to Category")
        }
      }
    }
    .sheet(isPresented: $isCategorySelectorVisible) {
      List {
        if categories.isEmpty {
          Text("No categories available. Go to settings and add a category.")
        } else {
          Text("Select a Category")
            .font(.headline)
          ForEach(categories) { category in
            Button {
              assignToCategory(category)
              isCategorySelectorVisible = false
            } label: {
              Text(category.title)
            }
          }
        }
      }
      .presentationDetents([.medium, .large])
    }
  }
}
