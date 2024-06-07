public class User{
    string Guid{get;set;}
    string ScreenName{get;set;}

    public User(string guid)
    {
        Guid = guid;
    }
}