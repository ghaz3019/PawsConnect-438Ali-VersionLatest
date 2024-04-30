import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import bcrypt from 'bcrypt';
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
// import translate from 'node-google-translate-skidz';
import translate from 'translate'

const app = express();
const saltRounds = 10;

app.use(cors({
  origin: "http://localhost:3000",
  method: ["POST", "GET"],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
app.use(bodyParser.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "paws_connect",
  port: 3306
});
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

app.post('/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;

  try {
    // Call the translation function from node-google-translate-skidz
    translate.engine = "libre";
    const translate_string = await translate(text, targetLanguage);

    // Send back the translated text
    res.json({ translate_string });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

const upload = multer({ storage: storage });

// app.use(express.json());
// app.use(cors());

app.get("/", (req, res) => {
  res.json("hello this is the backend")
});


app.get("/profile/:UserName", (req, res) => {
  const UserName = req.params.UserName
  const q = "SELECT * FROM UserProfile WHERE UserName = ?";
  // console.log("Executing SQL Query:", q, [UserName]);
  db.query(q, [UserName], (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
});

app.get("/pet/:PetName", (req, res) => {
  const PetName = req.params.PetName;
  const q = "SELECT * FROM petprofile WHERE Name = ?";
  db.query(q, [PetName], (err, data) => {
    if (err) return res.json(err)
    if (data.length === 0) return res.status(404).json({ message: "Pet not found" })
    return res.json(data)
  })
});

app.get("/pets/:userId", (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT petprofile.name FROM petprofile WHERE OwnerID = ?";
  db.query(q, [userId], (err, data) => {
    if (err) return res.json(err)
    if (data.length === 0) return res.status(404).json({ message: "Pets not found" })
    return res.json(data)
  })
});

/////////////////////////
app.get("/pets", (req, res) => {
  const q = "SELECT * FROM petprofile";

  db.query(q, (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).json({ message: "Pets not found" });
    return res.json(data);
  });
});
// ---------------------? 

app.post("/post/:UserName/:UserID", upload.single('photo'), (req, res) => {
  const q = "INSERT INTO post (`UserID`, `Caption`, `PhotoURL`, `Visibility`, `TaggedPets`) VALUES (?)";

  //convert the visibility to a number rather than true false
  const visibility = req.body.visibility ? 1 : 0;

  const values = [
    req.body.userID,
    req.body.caption,
    req.file.path, // use the path of the uploaded file
    visibility,
    req.body.taggedPets,
  ];
  db.query(q, [values], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      console.log("Executing SQL Query:", q, [values]);
      return res.json(data);
    }
  })
});

// app.post("/api/login", (req, res) => {
//     const { UserName, PasswordHash } = req.body;
//     const q = "SELECT * FROM UserProfile WHERE UserName = ? AND PasswordHash = ?";
//     //console.log("Executing SQL Query:", q, [UserName, PasswordHash]);
//     db.query(q, [UserName, PasswordHash], (err, data) => {
//         if(err) return res.json(err)
//         return res.json(data)
//     })
// });

// ------------------------------------------------------------ \\

// app.post("/api/login", async (req, res) => {
//   const { UserName, PasswordHash } = req.body;
//   let userPw = "";
//   let userData;
//   const q = "SELECT * FROM UserProfile WHERE UserName = ?";

//   try {
//     const data = await new Promise((resolve, reject) => {
//       db.query(q, [UserName], (err, data) => {
//         if (err) reject(err);
//         else resolve(data);
//       });
//     });

//     // console.log("Query executed. Data:", data);

//     if (data.length == 0) {
//       console.log("no user found");
//       return res.json({ LoggedIn: false });
//     }

//     userPw = data[0].PasswordHash;
//     userData = data[0];

//     // const match = await bcrypt.compare(PasswordHash, userPw);
//     // console.log("current session = ", req.session);

//     if (match) {
//       console.log("userData = ", userData);
//       req.session.user = userData;
//       console.log("Succrss");
//       return res.json({ data, LoggedIn: true });
//     } else {
//       console.log('no success')
//       return res.json({ LoggedIn: false });
//     }
//   } catch (error) {
//     console.error("Error executing login:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });


app.post("/api/login", async (req, res) => {
  const { UserName, PasswordHash } = req.body;
  let userData;
  const query = "SELECT * FROM UserProfile WHERE UserName = ?";

  try {
    const data = await new Promise((resolve, reject) => {
      db.query(query, [UserName], (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    if (data.length === 0) {
      console.log("No user found");
      return res.json({ LoggedIn: false, error: "Invalid username or password" });
    }

    userData = data[0];

    if (userData.PasswordHash === PasswordHash) {
      console.log("Login successful");
      // Assuming you want to exclude the password hash from the response
      delete userData.PasswordHash;
      req.session.user = userData; // Storing user data in the session
      return res.json({ user: userData, LoggedIn: true });
    } else {
      console.log("Incorrect password");
      return res.json({ LoggedIn: false, error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error executing login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ------------------------------------------------------------------------ \\

// ------------ SIGNUP ROUTES ------------ \\

// ------------ Checking For Existing User via UserName ------------ \\
app.get('/check-username/:username', async (req, res) => {
  const username = req.params.username;
  const q = "SELECT * FROM UserProfile WHERE DisplayName = ?";

  db.query(q, [username], (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  });
});

// ------------ Adding New User to DB ------------ \\
app.post("/signup", upload.single('ProfilePictureURL'), async (req, res) => {
  // const hashedpw = bcrypt.hashSync(req.body.PasswordHash, saltRounds);
  const q = "INSERT INTO UserProfile (`UserName`, `PasswordHash`, `DisplayName`, `ProfilePictureURL`, `Location`, `PreferredLanguage`, `Pets`, `Friends`) VALUES (?)";
  const values = [
    req.body.UserName,
    req.body.PasswordHash,
    req.body.DisplayName,
    req.file.path,
    req.body.Location,
    req.body.PreferredLanguage,
    JSON.stringify([]),
    JSON.stringify([])
  ];
  db.query(q, [values], (err, data) => {
    console.log("Query executed. Error:", err, "Data:", data);
    if (err) return res.json(err);
    return res.json(data);
  });
});



app.get("/edit/:UserID", (req, res) => {
  const profId = req.params.UserID;
  const q = "SELECT * FROM UserProfile WHERE UserID = ?";

  db.query(q, [profId], (err, data) => {
    if (err) return res.json(err)
    return res.json(data), console.log(data)
  })
});

app.delete("/edit/:UserID", (req, res) => {
  const profId = req.params.UserID;
  const q = "DELETE FROM UserProfile WHERE UserID = ?";

  db.query(q, [profId], (err, data) => {
    if (err) return res.json(err);
    return res.json("profile has been deleted successfully");
  });
});

app.put("/edit/:UserID", (req, res) => {
  const profId = req.params.UserID;
  const q = "UPDATE UserProfile SET `PasswordHash` = ?, `DisplayName` = ?, `ProfilePictureURL` = ?, `Location` = ?, `PreferredLanguage` = ? WHERE UserID = ?";

  const values = [
    req.body.PasswordHash,
    req.body.DisplayName,
    req.body.ProfilePictureURL,
    req.body.Location,
    req.body.PreferredLanguage,
  ];

  db.query(q, [...values, profId], (err, data) => {
    if (err) return res.json(err);
    return res.json("profile has been updated successfully");
  });
});


// ------------ POST RELATED ROUTES ------------ \\

// ------------ Inserting new post into DB ------------ \\
app.post("/post/:UserName/:UserID", upload.single("photo"), (req, res) => {
  const q =
    "INSERT INTO post (`UserID`, `Caption`, `PhotoURL`, `Visibility`, `TaggedPets`) VALUES (?)";
  //convert the visibility to a number rather than true false
  const visibility = req.body.visibility ? 1 : 0;

  const values = [
    req.body.userID,
    req.body.caption,
    req.file.path, // use the path of the uploaded file
    visibility,
    req.body.taggedPets,
  ];
  db.query(q, [values], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      console.log("Executing SQL Query:", q, [values]);
      return res.json(data);
    }
  });
});

// ------------------------------------------------------------------------ \\

// ------------ PET TRANSFER RELATED ROUTES ------------ \\

app.post("/transferPetRequest/:PetID/:UserID/:OwnerID", (req, res) => {
  //check that pet does not already have active transfer request
  const checkQuery =
    "SELECT * FROM transferrequest WHERE PetID = ? and requestAccepted = 0";
  const checkValues = [req.params.PetID];

  db.query(checkQuery, checkValues, (err, data) => {
    if (err) return res.json(err);
    if (data.length > 0)
      return res.status(400).json({ error: "Pet already being transferred" });

    const insertQuery =
      "INSERT INTO transferrequest (`PetID`, `UserID`, `OwnerID`, `requestAccepted`) VALUES (?)";
    const insertValues = [
      req.params.PetID,
      req.params.UserID,
      req.params.OwnerID,
      false,
    ];

    db.query(insertQuery, [insertValues], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
});

app.get("/fetchTransferRequests/:OwnerID", (req, res) => {
  const OwnerID = req.params.OwnerID;
  const q = `select t.transferID, t.OwnerID, t.PetID, p.Name, t.UserID, u.DisplayName
              from transferrequest t 
              join petprofile p on p.PetID = t.PetID 
              join userprofile u on u.UserID = t.UserID
              where t.OwnerID = (?) and t.requestAccepted = 0`;
  db.query(q, [OwnerID], (err, data) => {
    if (err) return res.json(err);
    //console.log(data);
    return res.json(data);
  });
});

app.get("/fetchIncomingRequests/:OwnerID", (req, res) => {
  const OwnerID = req.params.OwnerID;
  const q = `select t.transferID, t.OwnerID, o.DisplayName as OwnerName, t.PetID, p.Name, t.UserID, u.DisplayName
              from transferrequest t 
              join petprofile p on p.PetID = t.PetID 
              join userprofile u on u.UserID = t.UserID
              join userprofile o on o.UserID = t.OwnerID
              where t.UserID = (?) and t.requestAccepted = 0`;
  db.query(q, [OwnerID], (err, data) => {
    if (err) return res.json(err);
    //console.log(data);
    return res.json(data);
  });
});

app.put("/acceptTransferRequest/:TransferID", (req, res) => {
  const TransferID = req.params.TransferID;
  const q1 = "SELECT UserID FROM transferrequest WHERE TransferID = ?";
  db.query(q1, [TransferID], (err, result) => {
    if (err) return res.json(err);
    const UserID = result[0].UserID;
    const q2 =
      "UPDATE transferrequest SET requestAccepted = 1 WHERE TransferID = ?";
    db.query(q2, [TransferID], (err, data) => {
      if (err) return res.json(err);
      const q3 =
        "UPDATE petprofile SET OwnerID = ? WHERE PetID IN (SELECT PetID FROM transferrequest WHERE TransferID = ?)";
      db.query(q3, [UserID, TransferID], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
      });
    });
  });
});

app.delete("/denyTransferRequest/:TransferID", (req, res) => {
  const TransferID = req.params.TransferID;
  const q = "DELETE FROM transferrequest WHERE TransferID = ?";
  db.query(q, [TransferID], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
// ------------------------------------------------------------------------ \\

// ------------ LOGOUT ROUTE ------------ \\
app.post('/logout', (req, res) => {
  req.session.destroy();
  if (!req.session) {
    console.log("redirection")
    res.redirect('/');
  } else {
    console.log("idk what happened");
  }

});
// ------------------------------------------------------------------------ \\


// ------------ BACKEND SERVER CONNECTION ------------ \\

app.get("/all", (req, res) => {
  const q = "SELECT * FROM UserProfile";

  db.query(q, (err, data) => {
    if (err) return res.json(err);
    else
      return res.json(data);

  });
});

app.listen(8800, () => {
  console.log("welcome to backend!")
});
