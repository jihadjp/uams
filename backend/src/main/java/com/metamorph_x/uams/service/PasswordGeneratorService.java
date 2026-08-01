package com.metamorph_x.uams.service;

import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PasswordGeneratorService {

    private static final String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String CHAR_UPPER = CHAR_LOWER.toUpperCase();
    private static final String NUMBER = "0123456789";
    private static final String OTHER_CHAR = "!@#$%&*";

    private static final String PASSWORD_ALLOW_BASE = CHAR_LOWER + CHAR_UPPER + NUMBER + OTHER_CHAR;
    private static final SecureRandom random = new SecureRandom();

    public String generateRandomPassword(int length) {
        if (length < 4) length = 8;
        
        List<Character> charList = PASSWORD_ALLOW_BASE.chars()
                .mapToObj(data -> (char) data)
                .collect(Collectors.toList());
        
        Collections.shuffle(charList);
        
        StringBuilder result = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            result.append(charList.get(random.nextInt(charList.size())));
        }
        return result.toString();
    }
}
