//
//  Category.swift
//  PG5602_h24_12
//
// 
//

import Foundation
import SwiftData

@Model final class Category {
  @Attribute(.unique) var id: UUID
  var title: String
  var favorite: Bool
  var created: Date
  var updated: Date
  
  // 1 category - many articles
  @Relationship(deleteRule: .deny, inverse: \Article.category) var articles: [Article]?
  
  init() {
    id = UUID()
    title = ""
    favorite = false
    created = Date.now
    updated = Date.now
  }
}
