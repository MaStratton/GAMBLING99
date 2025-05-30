namespace GameService;

using System;

public class Slots
{

    /*
    "Cherry", 
    "Lemon",
    "Orange",
    "Plum",
    "Bell",
    "Bar",
    "Seven",
    "Grape",
    "Melon",
    "Star",
    "Diamond",
    "Penguin",
    "Clover",
    "Heart",
    "Skull"
    */

private static String[] ReelOne = new String[]
{
    "Cherry", "Lemon", "Orange", "Plum", "Bell",
    "Bar", "Seven", "Grape", "Melon", "Star",
    "Diamond", "Penguin", "Clover", "Heart", "Skull",
    "Cherry", "Lemon", "Bar", "Seven", "Diamond",
    "Cherry", "Orange", "Heart", "Clover", "Star"
};

private static String[] ReelTwo = new String[]
{
    "Bar", "Plum", "Lemon", "Orange", "Melon",
    "Heart", "Seven", "Diamond", "Star", "Clover",
    "Cherry", "Bell", "Skull", "Penguin", "Grape",
    "Lemon", "Cherry", "Orange", "Bell", "Diamond",
    "Skull", "Seven", "Plum", "Melon", "Bar"
};

private static String[] ReelThree = new String[]
{
    "Diamond", "Cherry", "Heart", "Clover", "Bar",
    "Seven", "Plum", "Orange", "Star", "Lemon",
    "Bell", "Melon", "Skull", "Grape", "Penguin",
    "Lemon", "Cherry", "Seven", "Bar", "Clover",
    "Orange", "Plum", "Heart", "Bell", "Star"
};

    public static String[] Spin()
    {
        Random r = new Random();
        return new String[] { ReelOne[r.Next(ReelOne.Length)], ReelTwo[r.Next(ReelTwo.Length)], ReelThree[r.Next(ReelThree.Length)] };
    }

    public static String[] Pull(ref int bet)
    {
        String[] result = Spin();
        if (result[0].Equals(result[1]) && result[1].Equals(result[2]))
        {
            switch (result[1])
            {
                case "Seven":
                    bet *= 1000;
                    break;
                case "Bar":
                    bet *= 500;
                    break;
                case "Diamond":
                    bet *= 250;
                    break;
                case "Cherry":
                    bet *= 150;
                    break;
                case "Bell":
                    bet *= 50;
                    break;
                case "Star":
                    bet *= 25;
                    break;
                default:
                    bet *= 5;
                    break;
            }
        }
        else
        {
            bet = bet * -1;
        }
        
        return result;
    }
}
