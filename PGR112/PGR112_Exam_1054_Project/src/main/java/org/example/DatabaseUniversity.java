package org.example;

import com.mysql.cj.jdbc.Driver;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseUniversity {
    static {
        try {
            DriverManager.registerDriver(new Driver());
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
    static Connection uniDbConnection() {
        try {
            return DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/unidb",
                    "unidb",
                    "unidbpw"
            );
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

}
