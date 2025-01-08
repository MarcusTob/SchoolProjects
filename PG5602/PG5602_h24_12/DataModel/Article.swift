//
//  Article.swift
//  PG5602_h24_12
//
//
//

import Foundation
import SwiftData

@Model final class Article {
  @Attribute(.unique) var id: UUID
  var title: String
  var source: String
  var author: String?
  var subtitle: String
  var publishedAt: Date?
  var url: URL?
  var urlToImage: URL?
  var content: String?
  var created: Date
  var updated: Date
  
  // 1 article - 1 category
  @Relationship var category: Category?

  init(title: String = "", subtitle: String = "") {
    id = UUID()
    source = ""
    author = ""
    self.title = title
    self.subtitle = subtitle
    created = Date.now
    updated = Date.now
  }
}
