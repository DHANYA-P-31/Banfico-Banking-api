package com.banfico.banking_api.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class InitialPasswordGeneratorTest {

    @Test
    public void testStandardNameAndPhone() {
        String password = InitialPasswordGenerator.generate("Dhanya", "9876543210");
        assertEquals("Dhan3210", password);
    }

    @Test
    public void testShortNameRaj() {
        String password = InitialPasswordGenerator.generate("Raj", "9876543210");
        assertEquals("Raja3210", password);
    }

    @Test
    public void testShortNameAbi() {
        String password = InitialPasswordGenerator.generate("Abi", "9876543210");
        assertEquals("Abia3210", password);
    }

    @Test
    public void testFormattedPhoneNumber() {
        String password = InitialPasswordGenerator.generate("Dhanya", "+91 9876543210");
        assertEquals("Dhan3210", password);
    }

    @Test
    public void testHyphenatedPhoneNumber() {
        String password = InitialPasswordGenerator.generate("Dhanya", "987-654-3210");
        assertEquals("Dhan3210", password);
    }

    @Test
    public void testNameWithSpace() {
        String password = InitialPasswordGenerator.generate("John Doe", "9876543210");
        assertEquals("John3210", password);
    }

    @Test
    public void testInvalidPhoneThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            InitialPasswordGenerator.generate("Dhanya", "123");
        });
    }

    @Test
    public void testNullNameThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            InitialPasswordGenerator.generate(null, "9876543210");
        });
    }
}
