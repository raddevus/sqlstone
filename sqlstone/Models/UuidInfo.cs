public class UuidInfo{
    string Uuid{get;set;}
    string IpAddr{get;set;}
    DateTime Created{get;set;}

    public UuidInfo(string uuid, string ipAddr)
    {
        Uuid = uuid;
        IpAddr = ipAddr;
        Created = DateTime.Now;
    }
}