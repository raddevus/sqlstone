public class UuidInfo{
    public Int64 Id{get;set;}
    public string Uuid{get;set;}
    public string IpAddr{get;set;}
    DateTime Created{get;set;} = DateTime.Now;
}