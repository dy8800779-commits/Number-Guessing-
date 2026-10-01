#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <windows.h>

#define RED     "\033[1;31m"
#define GREEN   "\033[1;32m"
#define YELLOW  "\033[1;33m"
#define RESET   "\033[0m"

int main() {

    int highScore = 0;
    char playAgain;

    do {

        int number, guess;
        int attempts = 0;
        int maxAttempts;
        int score = 100;
        int timeLimit;
        int choice;

        time_t startTime, currentTime;
        int elapsed;

        srand(time(0));

        number = rand() % 100 + 1;


        /* ================= DIFFICULTY ================= */

        printf(YELLOW
               "\nSelect Difficulty:\n"
               RESET);

        printf("1. Easy   (60 sec, 7 attempts)\n");
        printf("2. Medium (30 sec, 5 attempts)\n");
        printf("3. Hard   (15 sec, 3 attempts)\n");

        printf("Enter choice: ");

        scanf("%d", &choice);


        if (choice == 1) {

            timeLimit = 60;
            maxAttempts = 7;

        }

        else if (choice == 2) {

            timeLimit = 30;
            maxAttempts = 5;

        }

        else {

            timeLimit = 15;
            maxAttempts = 3;

        }


        /* ================= START TIMER ================= */

        startTime = time(NULL);


        printf(
            YELLOW
            "\nGuess the number between 1 and 100\n"
            RESET
        );

        printf(
            "Time limit: %d seconds\n",
            timeLimit
        );

        printf(
            "Max attempts: %d\n",
            maxAttempts
        );

        printf(
            "High score: %d\n\n",
            highScore
        );


        /* ================= GAME LOOP ================= */

        do {

            currentTime = time(NULL);

            elapsed =
                (int)(currentTime - startTime);


            /* ================= TIME CHECK ================= */

            if (elapsed >= timeLimit) {

                Beep(200, 800);

                printf(
                    RED
                    "\nTime over\n"
                    RESET
                );

                printf(
                    "Correct number: %d\n",
                    number
                );

                break;

            }


            printf(
                "Time left: %d seconds\n",
                timeLimit - elapsed
            );


            printf(
                "Enter your guess: "
            );


            scanf(
                "%d",
                &guess
            );


            attempts++;


            /* ================= TOO LOW ================= */

            if (guess < number) {

                int low[] = {
                    3000,
                    3500
                };


                for (
                    int i = 0;
                    i < 2;
                    i++
                ) {

                    Beep(
                        low[i],
                        200
                    );

                }


                score -= 10;


                printf(
                    RED
                    "Too low\n"
                    RESET
                );

            }


            /* ================= TOO HIGH ================= */

            else if (guess > number) {

                int high[] = {
                    7000,
                    6500
                };


                for (
                    int i = 0;
                    i < 2;
                    i++
                ) {

                    Beep(
                        high[i],
                        200
                    );

                }


                score -= 10;


                printf(
                    RED
                    "Too high\n"
                    RESET
                );

            }


            /* ================= CORRECT ================= */

            else {

                int win[] = {
                    5000,
                    7000,
                    9000
                };


                for (
                    int i = 0;
                    i < 3;
                    i++
                ) {

                    Beep(
                        win[i],
                        200
                    );

                }


                printf(
                    GREEN
                    "\nCorrect guess\n"
                    RESET
                );

                break;

            }


            /* ================= ATTEMPTS CHECK ================= */

            if (
                attempts >= maxAttempts
            ) {

                Beep(
                    200,
                    800
                );


                printf(
                    RED
                    "\nNo attempts left\n"
                    RESET
                );


                printf(
                    "Correct number: %d\n",
                    number
                );


                break;

            }


            printf(
                "Attempts left: %d  Score: %d\n\n",
                maxAttempts - attempts,
                score
            );


        } while (1);


        /* ================= FINAL SCORE ================= */

        printf(
            "\nFinal score: %d\n",
            score
        );


        /* ================= HIGH SCORE ================= */

        if (
            score > highScore
        ) {

            highScore = score;


            printf(
                GREEN
                "New high score\n"
                RESET
            );

        }


        /* ================= PLAY AGAIN ================= */

        printf(
            YELLOW
            "\nPlay again? "
            RESET
        );


        scanf(
            " %c",
            &playAgain
        );


    } while (
        playAgain == 'y' ||
        playAgain == 'Y'
    );


    printf(
        GREEN
        "\nProgram finished\n"
        RESET
    );


    return 0;
}