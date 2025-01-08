//
//  Country.swift
//  PG5602_h24_12
//
// 
//

import Foundation
import SwiftData

@Model final class Country {
    @Attribute(.unique) var iso: String
    var country: String
    var created: Date
    var favorite: Bool
    
    init(iso: String) {
        self.iso = iso
        self.country = ""
        self.created = Date.now
        self.favorite = false
    }
}
