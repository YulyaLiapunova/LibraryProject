<!DOCTYPE html>
<html>
<head>
    <title>Библиотека</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 80%;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #007bff;
            color: white;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
    </style>
</head>
<body>
<div class="container">
    <?php

    // Initialize cURL session
    $curl = curl_init();

    // Set cURL options
    curl_setopt($curl, CURLOPT_URL, "http://localhost:3000/api/books");
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HEADER, false);

    // Execute cURL session and get the response
    $booksResponse = curl_exec($curl);

    curl_setopt($curl, CURLOPT_URL, "http://localhost:3000/api/users");

    $usersResponse = curl_exec($curl);

    // Close cURL session
    curl_close($curl);

    // Decode JSON response to PHP array
    $books = json_decode($booksResponse, true);

    $users = json_decode($usersResponse, true);

    // Check if the response is valid
    if (is_array($books)) {
        // Start HTML table
        echo "<b>Таблица книг</b>";
        echo "<table border='1'>";
        echo "<tr><th>Название</th><th>Авторы</th><th>ISBN</th><th>Жанр</th><th>Год</th><th>Рейтинг</th><tr>";
    
        // Loop through each book and display in table rows
        foreach ($books as $book) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($book['name']) . "</td>";
            echo "<td>" . htmlspecialchars($book['authors']) . "</td>";
            echo "<td>" . htmlspecialchars($book['isbn']) . "</td>";
            echo "<td>" . htmlspecialchars($book['genre']) . "</td>";
            echo "<td>" . htmlspecialchars($book['year']) . "</td>";
            echo "<td>" . htmlspecialchars($book['rating']) . "</td>";
            echo "</tr>";
        }
    
        // End HTML table
        echo "</table>";
    } else {
        echo "Error: Unable to process the data.";
    }

    echo "<br>";

    if (is_array($users)) {
        // Start HTML table
        echo "<b>Таблица клиентов</b>";
        echo "<table border='1'>";
        echo "<tr><th>Имя</th><th>Фамилия</th><th>Email</th><th>Дата регистрации</th><tr>";
    
        // Loop through each user and display in table rows
        foreach ($users as $user) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($user['firstName']) . "</td>";
            echo "<td>" . htmlspecialchars($user['lastName']) . "</td>";
            echo "<td>" . htmlspecialchars($user['email']) . "</td>";
            echo "<td>" . htmlspecialchars($user['memberSince']) . "</td>";
            echo "</tr>";
        }
    
        // End HTML table
        echo "</table>";
    } else {
        echo "Error: Unable to process the data.";
    }

    ?>
</div>
</body>
</html>
