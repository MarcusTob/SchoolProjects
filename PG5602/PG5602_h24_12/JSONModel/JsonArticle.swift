//
//  JsonArticle.swift
//  PG5602_h24_12
//
//
//

import Foundation
import SwiftUI

struct Source: Decodable, Hashable {
  let id: String?
  let name: String
}

struct JsonArticle: Decodable, Hashable, Identifiable {
    let source: Source
    let author: String?
    let title: String
    let description: String?
    let url: String
    let urlToImage: String?
    let publishedAt: String
    let content: String?
    var id: String { title }
}


struct Response: Decodable {
  let status: String
  let totalResults: Int
  let articles: [JsonArticle]
}

enum JsonCategory: String {
  case all
  case business
  case entertainment
  case general
  case health
  case science
  case sports
  case technology
}

// fetch top headlines from api with search criteria
func getTopHeadlines(country: String, category: JsonCategory) async -> [JsonArticle] {
  @AppStorage("ApiKey") var apikey: String = ""
  @AppStorage("articleAmount") var articleAmount: Int = 5
  
  var url = "https://newsapi.org/v2/top-headlines?"
  
  if country != "" {
    url += "country=\(country)"
  }
  
  if category != JsonCategory.all {
    if country != "" { url += "&" }
    url += "category=\(category.rawValue)"
  }
  
  url += "&pagesize=\(articleAmount)&apiKey=\(apikey)"
  
  print("Using API Key: \(apikey)")
  
  guard let connection = URL(string: url) else {
    return []
  }
  
  do {
    let (data, response) = try await URLSession.shared.data(from: connection)
    
    if let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) {
      print("Data: \(data) Response: \(httpResponse.statusCode)")
      
      let response = try JSONDecoder().decode(Response.self, from: data)
        
      print("Status: \(response.status)")
      print("Total Results: \(response.totalResults)")
        
      return response.articles
    }
  }
  catch {
    print("Error message: \(error.localizedDescription)")
  }
  return []
}

// fetch articles from api based on keyword
func getJsonArticles(keyword: String) async -> [JsonArticle] {
  @AppStorage("ApiKey") var apikey: String = ""
  
  let url = "https://newsapi.org/v2/everything?q=\(keyword)&apiKey=\(apikey)"
  print(url)
  
  guard let connection = URL(string: url) else {
    return []
  }
  
  do {
    let (data, response) = try await URLSession.shared.data(from: connection)
    
    if let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) {
      print("Data: \(data) Response: \(httpResponse.statusCode)")
      
      let response = try JSONDecoder().decode(Response.self, from: data)
        
      print("Status: \(response.status)")
      print("Total Results: \(response.totalResults)")
        
      return response.articles
    }
  }
  catch {
    print("Error message: \(error.localizedDescription)")
  }
  return []
}
