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
        //return new String[] { ReelOne[r.Next(ReelOne.Length)], ReelTwo[r.Next(ReelTwo.Length)], ReelThree[r.Next(ReelThree.Length)] };
        return new String[] { "h", "h", "h" };
    }

    public static SlotsResult Pull(int bet)
    {
        //TODO Get LobbyService/userId/lobbyId to get user balance
        int balance = 100;
        String[] result = Spin();
        if (result[0].Equals(result[1]).Equals(result[2]))
        {
            Console.WriteLine("HIT");
        }
        
        
        return null;
    }
}
