//
//  PG5602_h24_12App.swift
//  PG5602_h24_12
//
// 
//

import SwiftUI
import SwiftData

@main struct PG5602_h24_12App: App {
  @State private var isSplash = true
  let container: ModelContainer
  
  init() {
    let schema = Schema([Article.self, Search.self, Country.self])
    
    //was told by lecturer using a .sqlite file is ok, even though the exam papers says to use .store
    //using sqlite for easier viewing of database content
    let url = URL.documentsDirectory.appending(path: "newsapi.sqlite")
    let config = ModelConfiguration(schema: schema, url: url)
    
    do {
      container = try ModelContainer(for: schema, configurations: config)
    }
    catch {
      fatalError("Error message: \(error.localizedDescription)")
    }
  }
  
  var body: some Scene {
    WindowGroup {
      if isSplash {
        SplashView(splash: $isSplash)
      }
      else {
        MainView()
      }
    }
    .modelContainer(container)
  }
}
