//
//  SplashView.swift
//  PG5602_h24_12
//
//
//

import SwiftUI

struct SplashView: View {
  @Binding var splash: Bool
  @State private var rotation: Double = 0.0
  @State private var scale: CGFloat = 0.5

  var body: some View {
    ZStack {
      Color.black
      
      Image("splashImage")
        .rotationEffect(.degrees(rotation))
        .scaleEffect(scale)
        .cornerRadius(20)
        .onAppear {
          withAnimation(.easeInOut(duration: 2.5)) {
            rotation = 720
            scale = 1.5
          }

          DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
            splash = false
          }
        }
    }
  }
}
