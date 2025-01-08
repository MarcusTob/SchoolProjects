//
//  NewsTickerView.swift
//  PG5602_h24_12
//
//
//

import SwiftUI

//news ticker is quite "buggy" sometimes scroll doesnt reset properly when changing some settings
//could not figure out how to fix it, but it does fix it by just disabling and enabling it again in the settings.
//was not able to make the newsticker headlines clickable, spent too much time trying to make it work.
struct NewsTickerView: View {
  let headlines: [String]
  @State private var offset: CGFloat = 0.0
  @State private var totalWidth: CGFloat = 0.0
  @AppStorage("newsTickerFontSize") private var newsTickerFontSize: Double = 16.0
  @AppStorage("newsTickerFontColor") private var newsTickerFontColor: String = "blue"
  
  var body: some View {
    GeometryReader { geometry in
      HStack(spacing: 40) {
        ForEach(headlines, id: \.self) { headline in
          Text(headline)
            .font(.system(size: CGFloat(newsTickerFontSize), weight: .bold))
            .lineLimit(1)
            .fixedSize(horizontal: true, vertical: false)
            .foregroundColor(Color(newsTickerFontColor))
            .padding(.horizontal, 20)
            .background(
              GeometryReader { textGeometry in
                Color.clear.onAppear {
                  DispatchQueue.main.async {
                    totalWidth += textGeometry.size.width + 40
                  }
                }
              }
            )
        }
      }
      .offset(x: offset)
      .onAppear {
        startScrolling(containerWidth: geometry.size.width)
      }
      .onChange(of: headlines) { _, _ in
        resetAndScroll(containerWidth: geometry.size.width)
      }
    }
    .frame(height: 50)
    .clipped()
  }

  private func startScrolling(containerWidth: CGFloat) {
    guard !headlines.isEmpty else { return }

    let animationDuration = (totalWidth + containerWidth) / 70
    offset = containerWidth

    withAnimation(Animation.linear(duration: animationDuration).repeatForever(autoreverses: false)) {
      offset = -(totalWidth + containerWidth)
    }
  }

  private func resetAndScroll(containerWidth: CGFloat) {
    offset = 0

    DispatchQueue.main.async {
      startScrolling(containerWidth: containerWidth)
    }
  }
}
//extension to make the color picker in settings apply to headlines
extension Color {
    init(_ name: String) {
        switch name.lowercased() {
        case "blue": self = .blue
        case "red": self = .red
        case "green": self = .green
        case "black": self = .black
        default: self = .blue
        }
    }
}
