package com.banfico.banking_api.util;

public class InitialPasswordGenerator {

    /**
     * Generates an initial password based on the rule:
     * [first 4 characters of customer name, padded with 'a'] + [last 4 digits of phone number]
     *
     * Example:
     * Name: Dhanya, Phone: 9876543210 -> Dhan3210
     * Name: Raj, Phone: 9876543210 -> Raja3210
     * Name: Abi, Phone: +91 9876543210 -> Abia3210
     */
    public static String generate(String name, String phoneNumber) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Customer name is required for password generation");
        }
        if (phoneNumber == null || phoneNumber.isBlank()) {
            throw new IllegalArgumentException("Phone number is required for password generation");
        }

        // 1. Extract non-whitespace characters from name
        String cleanName = name.replaceAll("\\s+", "");
        if (cleanName.isEmpty()) {
            cleanName = "a";
        }

        StringBuilder namePrefix = new StringBuilder();
        if (cleanName.length() >= 4) {
            namePrefix.append(cleanName.substring(0, 4));
        } else {
            namePrefix.append(cleanName);
            while (namePrefix.length() < 4) {
                namePrefix.append('a');
            }
        }

        // 2. Extract numeric digits from phone number
        String digitsOnly = phoneNumber.replaceAll("\\D+", "");
        if (digitsOnly.length() < 4) {
            throw new IllegalArgumentException("Phone number must contain at least 4 numeric digits");
        }

        String phoneSuffix = digitsOnly.substring(digitsOnly.length() - 4);

        return namePrefix.toString() + phoneSuffix;
    }
}
