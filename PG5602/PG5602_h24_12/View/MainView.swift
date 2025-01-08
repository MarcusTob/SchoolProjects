//
//  MainView.swift
//  PG5602_h24_12
//
//
//

import SwiftUI

struct MainView: View {
  @AppStorage("isDarkMode") private var darkMode = false
  var body: some View
  {
    TabView {
      HomeView().tabItem {
        Label("My articles", systemImage: "newspaper.fill")
      }
      
      SearchView().tabItem {
        Label("Search articles", systemImage: "text.magnifyingglass")
      }
      
      SettingView().tabItem {
        Label("Setttings", systemImage: "gearshape.fill")
      }
    }
    .environment(\.colorScheme, darkMode ? .dark : .light)
  }
}
