
# Mastermind Web Application: A digital version of the classic board game

This is a web replica of the Mastermind game i've developed for a course in University. It's main purpouse is to make people able to enjoy the game with a less cumbersome and more portable version.

Mastermind is a logic game where you have to guess a randomly generated color sequence. In this web version, you can challenge yourself in three different modes.

## Installation and Run Locally
1. Clone the repository:
    ```sh
      git clone https://github.com/jonnyfratta/Mastermind_Web_Application.git
    ```

2. Install XAMPP or any equivalent platform

3. Move the directory of the project into the following path:
   ```sh
    XAMPP/htdocs
    ```

4. Turn on the Apache Server and MySQL Database  

5. Import the database through the phpmyadmin page:
    1. Search in your browser for     
        ```sh
        localhost/phpmyadmin
        ```
    2. Among the options in the upper part of the page, select 'Import'
    3. In the "file to import" section, select the file addressed by the following path: 
       ```sh
        Mastermind_Web_Application/SQL/DataBase.sql
        ```
    and then press 'Import" at the bottom of the page.


6. Now search the following path in your browser:
    ```sh
    localhost/Mastermind_Web_Application
    ```

7. Enjoy

## Usage/Examples
The game allows the player to challenge himself in three different modes:

- Single Match: as the name sudgests, it allows the user to play just one match. The game starts automatically so as soon as you enter the page you can start selecting colours from the color selector at the bottom right of the board and then check your guess with the button in the smartphone on the right.

- Competitve Mode: this mode allows the user to play consecutive matches as long as they keep winning. The more the winning streak grows, the more obstacles are put in the way.

- Custom Mode: this mode allows the user to choose their personalized dimensions of the board (number of guesses and number of colours to be guessed)


## Development
This website was developed for the "Progettazione Web" exam in my bachelor's degree in Computer Engineering. It was thought to be desplayed on screens with a 1920x1080 resolution and it's currently not responsive.

## Authors

- [@jonnyfratta](https://github.com/jonnyfratta)

