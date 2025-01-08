//
//  Search.swift
//  PG5602_h24_12
//
//
//

import Foundation
import SwiftData

@Model final class Search {
  @Attribute(.unique) var id: UUID
  var title: String
  var created: Date
  
  init() {
    id = UUID()
    title = ""
    created = Date.now
  }
}
