Read (better formatted) article at my blog: [https://buildip.dev/?p=112](https://buildip.dev/?p=112)

Source code is at my github repo: <a href="https://github.com/raddevus/sqlstone" target="_blank" rel="noopener">https://github.com/raddevus/sqlstone</a>
<h2>Introduction</h2>
I want to write a SaaS (Software as a Service) which:
<ol>
 	<li>requires as little support &amp; maintenance as possible</li>
 	<li>is highly available</li>
 	<li>solves a problem which real users have</li>
 	<li>costs little to run</li>
 	<li>earns $$$</li>
</ol>
Over time I've solved many of these challenges.  For example, I've fulfilled items number one, two and four  in the previous list by discovering how to get a .NET Core WebAPI running on a DigitalOcean (Debian-based) droplet (which only costs $6 / month).
<h3>Storing Data: Main Challenge</h3>
In the modern world of building apps the real challenge lies in the realm of data storage.

Building the front-end is relatively easy and basically requires nothing more than some text files, text editor and a web browser.  (<strong>Note</strong>: I'm not saying that creating a beautiful, functional UI design is easy.  I am saying those challenges don't sit so much in the technology realm (as backend does).)

In contrast, saving data so it is remotely accessible from any device still lands high on the list of difficult technology-based challenges.

Also, this article is somewhat of a Part-2 to my previous article here on CP where I posed the question: <a href="https://www.codeproject.com/Articles/5379359/How-Much-Can-Sqlite-Handle-Multiple-Threads-Concur">How Much Can Sqlite Handle? Multiple Threads Concurrently Inserting Into Sqlite</a>[<a title="New Window" href="https://www.codeproject.com/Articles/5379359/How-Much-Can-Sqlite-Handle-Multiple-Threads-Concur" target="_blank" rel="noopener">^</a>]
<h4>Making Data Accessible From Any Device</h4>
These days, users have multiple devices (iPads, Android Phones, Desktop computers, laptops) and may want to access their data (use your app) from any one of these devices at any given time.

To make data accessible from any device you're going to need to build some server side software.  In addition to that you're going to need to know how to configure various software (web servers, databases, etc.).  You're also going to have to create a data schema (structures for storing the user's data).  After that, you're going to need to insure the data is available at all times:
<ol>
 	<li>making sure the web site is up,</li>
 	<li>making sure the database is running,</li>
 	<li>making sure there is proper connectivity to your app</li>
</ol>
There are just so many things to do when you attempt to make data accessible from any device and any location.
<h2>What This Article Is About</h2>
This article is an attempt to simplify those challenges at least a little bit by:
<ol>
 	<li>Creating a reproducible way of providing each user with their own copy of their data</li>
 	<li>Making it so the user is able to manage accessibililty to their own data (providing the ability to download their copy of the database &amp; use it in an offline local copy of the associated app.</li>
</ol>
<h3>Technologies Used</h3>
To make these things possible, I've used the simplest technologies available (what I consider to be the most direct / easy way to store the user's data remotely):
<ol>
 	<li>.NET Core WebAPI - to post data to remote data store</li>
 	<li>Sqlite - text-based database which supports SQL queries (so users can use their data in numerous ways)</li>
 	<li>Entity Framework Core - In the past I never used EF because it felt bad &amp; I like to create my own Stored Procs.  However, Sqlite doesn't support Store Procs anyways and the SQL used for this project is extremely simple &amp; it makes sense to use EF Core.  Also, once you start using EF you kind of get addicted to it, because it is so easy.</li>
</ol>
<h3>What Will the WebAPI Framework Provide</h3>
I've used these two technologies to provide a framework of sorts which a developer can quickly build upon to create the specific target SaaS to create end-user apps.
<h3>Example Target App</h3>
An example target app (wrapped up in my extremely small "framework") is a Daily Journal app which allows the user to store daily free-form notes of activities they accomplished, ideas they have, etc.
<h2>Sqlstone: The Importance of a Project Name</h2>
One of the first things you need, when starting a project, is a cool / unique project name.  To create a cool and unique project name, you should put words together that don't necessarily make sense.

That's whay I've named this project Sqlstone.  See how it confuses you and inspires confidence that this will be a huge Open Source Project?
<h3>Daily Journal App: Try It Online</h3>
I've built an extremely basic version of a Daily Journaling app (on top of Sqlstone) and we'll use that code to show how this idea of each user getting his own database will work.

You can try the app out where it is running on my web site: [https://newlibre.com/journal](https://newlibre.com/journal)

I will walk you through the steps of using the Daily Journal app, but first let's talk about the simple Sqlstone Framework to discover what it can do for your app.
<h2>Sqlstone Summarized</h2>
The main thing the Sqlstone project does for you is:

Copies your custom Sqlite DB to the user's File Space (on your web server).
<h3>Where Is User's File Space Located?</h3>
<h4>wwwroot</h4>
For .NET Core WebAPIs and MVC apps the projects create a <code>wwwroot</code> folder where web content is served from.
<h4>UUID Folder Name</h4>
Underneath that folder, the Sqlstone code will create a uniquely named folder based upon a UUID.

That folder will be created for the user when she register's her UUID (which is generated by the target app).  You'll see all of this with associated screen shots when we walk through the Daily Journal app further along in this article.
<h2>What Does the Sqlstone Code Do?</h2>
Almost all of the code for Sqlstone is implemented in the <code>UserController.cs</code> class.

When the user posts to the UserController to register her <code>UUID</code> the system will call the <code>RegisterUser</code> API method.  When that method is called, the <code>UserController</code> constructor will run and configure a few items.

Let's take a look at the <code>UserController</code> Constructor because it helps illuminate a few things.
<pre lang="cs">public UserController(ILogger&lt;UserController&gt; logger, 
            IConfiguration _configuration,
            IWebHostEnvironment webHostEnvironment)
    {
        _logger = logger;
        templateDbFile = _configuration["templateDbFile"];
        Console.WriteLine($"content rootPath: {webHostEnvironment.WebRootPath}");
        webRootPath = webHostEnvironment.WebRootPath;
        contentRootPath = webHostEnvironment.ContentRootPath;
    }</pre>
<h3>Two Injected Interfaces Are Used</h3>
The default Controller normally just has the one <code>ILogger</code> parameter.  But, in our UserController I've injected two Interfaces:
<ol>
 	<li>IConfiguration</li>
 	<li>IWebHostEnvironment</li>
</ol>
I've added those so that we can:
<ol>
 	<li>Read values from our App configuration (set in the <code>appSettings.json</code> file in the project).</li>
 	<li>Read some WebHost environment settings that we will use so we can store a fresh copy of the target solution's Sqlite Database in the user's file space.</li>
</ol>
<h3>AppSettings.json: templateDbFile</h3>
The <code>templateDbFile</code> is the file which will contain all of the tables which the target project (the project you are building on top of Sqlstone).  In our case, this will be the database for the Daily Journal App.

Here's the entire contents of the <code>appSettings.json</code> file as it is defined in the source code for the Journal app.
<pre lang="jscript">{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "templateDbFile": "sqlstone_journal.db"
}</pre>
The <code>Logging</code> section contains the default values that are included in .NET Core MVC apps.

The value we want to focus on here is the <code>templateDbFile</code> which I've set to be: <code>sqlstone_journal.db</code>.

This is the value which is read from the UserController constructor on the following line of code:
<pre lang="cs">templateDbFile = _configuration["templateDbFile"];</pre>
That allows us to use whatever value we want to use to refer to the target database.

In the constructor we load the value into a member variable so we can use it later (in the <code>RegisterUser</code>() API call).
<h3>IWebHostEnvironment: Getting Paths</h3>
Now, we need the paths that we'll use to:
<ol>
 	<li>copy the database template file from</li>
 	<li>copy the database to the user's UUID folder</li>
</ol>
Because we've injected the IWebHostEnvironment into our constructor we can now get the:
<ol>
 	<li><code>webRootPath</code>: path to web root (this is basically the folder above the wwwroot -- this is the locaton where the web binaries of your solution are deployed to</li>
 	<li><code>contentRootPath</code>: path to the wwwroot folder (all content is served from wwwroot folder)</li>
</ol>
Now that we have an idea of those items which are set, we can talk about what happens when a User registers his UUID.
<h2>User / UUID Registration</h2>
For a user to use an app which is built on top of this very simple Sqlstone framework they will have to register a UUID.
<h3>Registering Creates User File Space &amp; Personal Database</h3>
This will be required for all Apps built on top of Sqlstone, because this will :
<ol>
 	<li>Create the User's File Space (under the wwwroot directory). The directory will have the format of <code>wwwroot/&lt;UUID&gt;</code></li>
 	<li>Copy a fresh instance of the target Sqlite database into the user's <code>wwwroot/&lt;UUID&gt;</code> directory.</li>
</ol>
<h4>Very Simple Identification</h4>
Registering the UUID creates a very simple way to identify which database the User's content will be stored in.

Yes, this means there are no passwords (at this time) required to store data in the target database.  We will discuss this further later.  (<strong>Hint</strong>: At some point in a future article, I will even show you how to encrypt each user's data using Authenticated AES256 encryption.)
<h4>Keeping the Main Idea, The Main Focus</h4>
For now, understand that this is a prototype to discover if this method of allowing every user to have their own copy of their own Sqlite database works well or not.
<h3>Work Flow of Steps When User Registers UUID</h3>
Here's the entire RegisterUser() method which takes a String which represents the user's UUID.
<pre lang="cs">[HttpPost]
    public ActionResult RegisterUser([FromQuery] string uuid){
        Console.WriteLine($"uuid: {uuid}");
        User u = new User(uuid);
        var ipAddr = HelperTool.GetIpAddress(Request);
        
        var userDir = Path.Combine(webRootPath,uuid);
        var journalDb = Path.Combine(contentRootPath,templateDbFile);
        
        Directory.CreateDirectory(userDir);
        var userDbFile = Path.Combine(userDir,templateDbFile);
        Console.WriteLine($"userDbFile: {userDbFile}");
        if (!System.IO.File.Exists( userDbFile)){
            
            try{
                Console.WriteLine($"{journalDb} \n {userDir}");
                System.IO.File.Copy(journalDb,Path.Combine(userDir, userDbFile));
            }
            catch{
                return new JsonResult(new {result=false, error="Couldn't register user. Try again."});
            }
            UuidInfo info = new UuidInfo{Uuid=uuid,IpAddr=ipAddr};
            UuidInfoContext uuidCtx = new UuidInfoContext(contentRootPath);
            uuidCtx.Add(info);
            uuidCtx.SaveChanges();
        }
        else{
            Console.WriteLine("User is already registered.");
        }
    

        return new JsonResult(new {result=true, directory=webRootPath, ip=ipAddr});
    }</pre>
Here is basically what happens during User Registration.
<ol>
 	<li>Get the UUID from the data posted by the user.  Yes, in this case I have the client generate the UUID.  (I'll show you the JavaScript that does that further down in the article.)  I can easily have the .NET C# code generate the UUID but I just arbitrarily decided to put this on the client side.  If you want it that way, you can easily convert this method to do the work on Server side.</li>
 	<li>Get the IpAddress so we can track the IP address which registers each UUID.  I do this just so I can control an attack of someone generate thousands of UUIDs (and resulting folders).</li>
 	<li>Create the User's File Space (UUID directory under wwwroot) if it doesn't exist.</li>
 	<li>Check to see if the UserDbFile already exists in the User File Space.  If the template file has already been created, we obviously don't want to overwrite it.</li>
 	<li>If User's db file doesn't already exist then copy the template one found at <code>webRootPath\sqlstone_journal.db</code></li>
 	<li>Create the <code>UuidInfo</code> object, a simple object which wraps up the <code>UUID</code>, <code>IpAddress</code>, and <code>Created</code> date.</li>
 	<li>Store UuidInfo data in the <code>sqlstone.db</code>. The <code>sqlstone.db</code> is only accessible to Admins of the Sqlstone framework.  It's just a simple way to determine how many users have registered to try the project out.</li>
</ol>
That's it.  Once the User is registered, she will be able to use the rest of the system. I'll walk you through using the Journal App so you can try it at my web site (or by downloading the code and trying it locally).

But, first, let me explain a bit more about the Database Template file.
<h2>A Bit More About The Database Template File</h2>
The database template file (<code>sqlstone_journal.db</code>) is an empty database which contains only the table schemas for your target project.

For the Journal App we only have one table, named <code>JEntry</code> (Journal Entry), in the database which is defined in the following way:
<pre lang="sql">CREATE TABLE [JEntry]
( [ID] INTEGER NOT NULL PRIMARY KEY,
  [Title] NVARCHAR(250) check(length(Title) &lt;= 250),
  [Note] NVARCHAR(3000) NOT NULL check(length(Title) &lt;= 3000),
  [Created] NVARCHAR(30) default (datetime('now','localtime')) 
  check(length(Created) &lt;= 30),
  [Updated] NVARCHAR(30) check(length(Updated) &lt;= 30)
);</pre>
You can find that definition in a file in the project source code, in the <code>sql</code> folder.

In your target solution you will have a different set of tables which will be used by your target app to store its data.  Then you'll place your database template file (containing only tables &amp; no data) in the webRootFolder (folder above <code>wwwroot</code>) and each time a user registers to use your target app, the template database will be copied to her wwwroot/&lt;UUID&gt; folder so that her data will be saved in her own private copy.

Now that we've discussed the basics of how this very small Sqlstone framework operates, let's take a look at a solution that is built on top of it.
<h2>Journal App: Built On Top Of Sqlstone</h2>
You are probably thinking, "Hmm...this is a very simple idea.  All he is doing here is giving every user their own Sqlite database."  You are right.  It's very simple.  Now I want to know if it is feasible to use in a true poduction environment.   I think it'll work.

Here's the current (simple &amp; basic UI) of my Journal App.

<img class="alignnone size-full wp-image-113" src="https://buildip.dev/wp-content/uploads/2024/06/sqlstone_001.png" alt="" width="749" height="746" />

That's a snapshot, after the user has already:
<ol>
 	<li>registered a UUID</li>
 	<li>Added some data</li>
</ol>
<h3>Before Registering a UUID</h3>
However, when you visit my web site and the Journal App loads (<a href="https://newlibre.com/journal" target="_blank" rel="noopener">https://newlibre.com/journal^</a>) or run it locally, you're going to see something different, since your <code>UUID</code> won't be registered yet.

<img class="alignnone size-full wp-image-114" src="https://buildip.dev/wp-content/uploads/2024/06/sqlstone_002.png" alt="" width="933" height="453" />

As you can see, the user has not generated or registered a <code>UUID</code> so there is not much here.
<h3>Generate and Set A UUID</h3>
To begin, click the <strong>[Gen / Set UUID] </strong>button.

That will:
<ol>
 	<li>Generate a brand new <code>UUID</code></li>
 	<li>Store it in your <code>localStorage</code> (now any time you visit this page from this device and browser you'll see that <code>UUID</code>).</li>
 	<li>Display it in the <code>UUID</code> text box.</li>
</ol>
<h3>Register Your UUID</h3>
You now have to click the <strong>[Register UUID] </strong>button to post the <code>UUID</code> to the server so it can create your user file space and copy the database template file to that space.

The client-side UI will let you know that the UUID was registered with a temporary alert:

<img class="alignnone size-full wp-image-115" src="https://buildip.dev/wp-content/uploads/2024/06/sqlstone_003.png" alt="" width="653" height="404" />

Now you can create your first Journal Entry.

<strong>NOTE</strong>: The Journal App will not allow you to create a new <code>Journal Entry </code>withou first Generating and Registering your UUID.
<h3>Create Your First Journal Entry</h3>
Now that you've registered your UUID and your remote file system space is created, you are ready to create a Journal Entry.

Click the <strong>[Add New Entry]</strong> button and you'll see a blank entry appear.

<img class="alignnone size-full wp-image-116" src="https://buildip.dev/wp-content/uploads/2024/06/sqlstone_004.png" alt="" width="966" height="340" />Fill out the <code>Note</code> field (an HTML <code>TextArea</code>) with some text.  You can even save emoticons if you want.

Click the <strong>[Save]</strong> button to <code>POST</code> the data to the web site and save it in your copy of the <code>sqlstone_journal.db</code>.

When you click the <strong>[Save] </strong>button, a <code>Prompt</code> dialog will popup so you can add a Title if you want.

<img class="alignnone size-full wp-image-117" src="https://buildip.dev/wp-content/uploads/2024/06/sqlstone_005.png" alt="" width="933" height="696" />

To save a Title, just type some text in the Prompt field and press &lt;ENTER&gt; or click the [OK] button.

If you don't want a Title to be saved, then you can click the [Cancel] button or hit the &lt;ESC&gt; button.

Your data will be posted to the web site and stored in your Sqlite database.

Again, you'll see an alert stating that the data was saved.
<img class="alignnone size-full wp-image-118" src="https://buildip.dev/wp-content/uploads/2024/06/sqlstone_006.png" alt="" width="769" height="680" />

&nbsp;
<h3>You Can Edit Your Data Too</h3>
If you want to change or add to the Note field or just add a Title, then just make your changes and click the<strong> [Save] </strong>button again.  This time the data for the record will be updated in the database.
If you do Update the data, then the <code>Updated</code> field will show a date when you last updated.

More to come, soon.
