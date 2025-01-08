//
//  SettingView.swift
//  PG5602_h24_12
//
//
//

import SwiftUI
import SwiftData

struct SettingView: View {
  @Environment(\.modelContext) private var context
  @Query(sort: \Country.iso, order: .forward) private var countries: [Country]
  @Query(sort: \Category.title, order: .forward) private var categories: [Category]
  @State private var isAddingCategory = false
  @State private var newCategoryTitle = ""
  @AppStorage("articleAmount") private var articleAmount: Int = 5
  @AppStorage("isDarkMode") private var isDarkMode = false
  @AppStorage("isNewsTickerEnabled") private var isNewsTickerEnabled: Bool = true
  @AppStorage("ApiKey") private var apiKey: String = "0cf510293c9346ce957f4838b1211a4c"
  @AppStorage("tickerPosition") private var tickerPosition: String = "Top"
  @AppStorage("newsTickerFontSize") private var newsTickerFontSize: Double = 16.0
  @AppStorage("newsTickerFontColor") private var newsTickerFontColor: String = "blue"
  
  @ViewBuilder
  private func categorySection() -> some View {
    Section("Manage Categories") {
      ForEach(categories) { category in
        HStack {
          VStack(alignment: .leading) {
            Text(category.title)
              .font(.headline)
            Text(category.created, style: .date)
              .font(.subheadline)
              .foregroundColor(.gray)
          }
          Spacer()
          Button(category.favorite ? "Unfavorite" : "Favorite") {
            toggleFavorite(for: category)
          }
          .buttonStyle(.bordered)
          Button(role: .destructive) {
            deleteCategory(category)
          } label: {
            Image(systemName: "trash")
          }
          .buttonStyle(.plain)
        }
      }
    }
  }

  var body: some View {
    NavigationStack {
      List {
        // Dark Mode Section
        Section("Appearance") {
          Toggle("Dark Mode", isOn: $isDarkMode)
            .toggleStyle(SwitchToggleStyle(tint: .blue))
        }

        Section("API Key") {
          TextField("Enter API Key", text: $apiKey)
            .textFieldStyle(.roundedBorder)
        }
              
        // section to manage categories
        categorySection()
        
        // section for adding categories
        Section("Add Categories") {
          Button("Add a Category") {
            isAddingCategory = true
          }
          .frame(maxWidth: .infinity, minHeight: 50)
        }
        
        // Section for News ticker
        Section("News Ticker Settings") {
          Picker("Ticker Position", selection: $tickerPosition) {
            Text("Top").tag("Top")
            Text("Bottom").tag("Bottom")
          }
          .pickerStyle(.segmented)
          
          Toggle("Enable News Ticker", isOn: $isNewsTickerEnabled)
            .toggleStyle(SwitchToggleStyle(tint: .blue))
          
          Stepper(value: $articleAmount, in: 1...20) {
            Text("Number of Headlines: \(articleAmount)")
          }
          
          Text("Font Size: \(Int(newsTickerFontSize))")
            .font(.caption)
          Slider(value: $newsTickerFontSize, in: 12...36, step: 1) {
            Text("Font Size")
          }
          
          Picker("Font Color", selection: $newsTickerFontColor) {
            Text("Blue").tag("blue")
            Text("Red").tag("red")
            Text("Green").tag("green")
            Text("Black").tag("black")
          }
          .pickerStyle(.segmented)
        }

        // Section to manage countries
        Section("Available Languages") {
          ForEach(countries) { country in
            HStack {
              Text(country.iso.uppercased())
                .font(.headline)
              Spacer()
              Button(country.favorite ? "Unfavorite" : "Favorite") {
                toggleFavorite(for: country)
              }
              .buttonStyle(.bordered)
            }
          }
        }
      }
      .onAppear {
        if countries.isEmpty {
          setCountries(context: context)
        }
      }
      .navigationTitle("Settings")
      .buttonStyle(.borderedProminent)
      .sheet(isPresented: $isAddingCategory) {
        VStack {
          Text("Add New Category")
            .font(.headline)
          TextField("Enter category title", text: $newCategoryTitle)
            .textFieldStyle(.roundedBorder)
          HStack {
            Button("Cancel") {
              isAddingCategory = false
            }
            .padding()
            Button("Save") {
              addCategory()
              isAddingCategory = false
            }
            .padding()
            .disabled(newCategoryTitle.isEmpty)
          }
        }
        .padding()
      }
    }
  }
  
  func setCountries(context: ModelContext) {
    //countries according to API documentation
    let countries = ["ar", "de", "en", "es", "fr", "he", "it", "nl", "no", "pt", "ru", "sv", "ud", "zh"]
    
    for iso in countries {
      let country = Country(iso: iso)
      context.insert(country)
      print("Inserted country: \(country.iso)")
    }
    do {
      try context.save()
      print("Countries saved")
    } catch {
      print("Error message: \(error.localizedDescription)")
    }
  }

  // Adds a new category to the database
  private func addCategory() {
    let newCategory = Category()
    newCategory.title = newCategoryTitle
    newCategory.created = Date.now
    newCategory.updated = Date.now
    context.insert(newCategory)
    do {
      try context.save()
      newCategoryTitle = "" // Clear inputs after saving
    } catch {
      print("Failed to save category: \(error.localizedDescription)")
    }
  }

  // Deletes a category
  private func deleteCategory(_ category: Category) {
    context.delete(category)
    do {
      try context.save()
    } catch {
      print("Failed to delete category: \(error.localizedDescription)")
    }
  }

  // Toggles the favorite status of a category
  private func toggleFavorite(for category: Category) {
    category.favorite.toggle()
    do {
      try context.save()
    } catch {
      print("Failed to update favorite category: \(error.localizedDescription)")
    }
  }

  // Toggles the favorite status of a country
  private func toggleFavorite(for country: Country) {
    country.favorite.toggle()
    do {
      try context.save()
    } catch {
      print("Failed to update favorite country: \(error.localizedDescription)")
    }
  }
}
