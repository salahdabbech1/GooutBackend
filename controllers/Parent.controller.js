const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("../Middleware/multer.config");
const nodemailer = require("nodemailer");
const Parent = require("../Models/Parent.model");
const Kid = require("../Models/Kid.model");
const Task = require("../Models/Kid.model")

module.exports = {
  Getall: async(req,res)=>{
    const users = await Parent.find()
                              

    if (users) {
        res.status(200).json({ users, message: "success" })
    } else {
        res.status(403).send({ message: "fail" })
    }
    
  },
  Profile: async(req,res) => {
    const users = await Parent.findById(req.params.id)
                              

    if (users) {
        res.status(200).send({ users, message: "success" })
    } else {
        res.status(403).send({ message: "fail" })
    }
    
  },
  RegisterParent: async (req, res) => {
    await Parent.init();
    console.log(req.body)
    const hashedPass = await Bcrypt.hash(req.body.Password, 10);   
    parent = new Parent({
      Name: req.body.Name,
      Email: req.body.Email,
      Password: hashedPass,
    });
    console.log(parent)
    try {
      parent.save();
      res.status(201).json(parent);
    } catch (error) {
      res.status(400).json({ reponse: error.message });
    }

  },
  loginParent: async (req, res) => {
    console.log(req.body);
   const  parent = await Parent.findOne({ Email: req.body.Email },)

    
    try {
      if (await Bcrypt.compare(req.body.Password, parent.Password)) {
        const token = jwt.sign({ Email: parent.Email }, "SECRET");
        if (token) {
          console.log(parent);
          res.status(201).json( parent );
        }
      } else {
        res.status(400).json({ reponse: "mdp incorrect" });
      }
    } catch (error) {
      res.status(500).json({ reponse: error });
    }
  },
  loginKid: async (req, res) => {
    console.log(req.body);
    thekid = await Kid.findOne({ Email: req.body.Email })
    try {
      if (await Bcrypt.compare(req.body.Password, thekid.Password)) {
        const token = jwt.sign({ Email: thekid.Email }, "SECRET");
        if (token) {
          res.status(201).json(thekid)
        }
      } else {
        res.status(400).json({ reponse: "mdp incorrect" });
        console.log("status 400")
      }
    } catch (error) {
      res.status(500).json({ reponse: error });
      console.log("status 500")
    }
  },
  
  GetParentbymail: async (req, res, next) => {
    let parent;
    try {
      parent = await Parent.findOne({ Email: req.body.Email });
      if (parent == null) {
        return res.status(404).json({ reponse: "mail non trouve" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ reponse: error.message });
    }
    res.Parent = parent;
    console.log(parent)
    next();
  },
  authentificateToken: (req, res, next) => {
    const autHeader = req.headers["authorization"];
    const token = autHeader && autHeader.split(" ")[1];

    if (token == null) return res.status(401).json({ reponse: "no token" });

    jwt.verify(token, "SECRET", (err, user) => {
      if (err) return res.status(403).json({ reponse: "token invalide" });
      req.user = user;
      next();
    });
  },
  RegisterKid: async (req, res) => {
    await Kid.init();
    const hashedPass = await Bcrypt.hash(req.body.Password, 10);
    tfol = new Kid({
      Name: req.body.Name,
      Last_name: req.body.Last_name,
      Email: req.body.Email,
      Password: hashedPass,
      Myparent: req.params.id
    });
    const parent = await Parent.findById({_id:req.params.id});
    console.log(parent)
    try {
      const newkid = await tfol.save();
      parent.Kids.push(tfol)
      parent.save()
      res.status(201).json({ tfol: newkid, reponse: "good" });
    } catch (error) {
      res.status(400).json({ reponse: error.message });
    }
    
  },
  changeimage: async (req,res)=>{
    
  },
  changerMotDePasse: async (req, res) => {
    const { Email, nouveauMotDePasse } = req.body
    console.log(req.body)
  
    nouveauMdpEncrypted = await Bcrypt.hash(nouveauMotDePasse, 10)
  
    let parent = await Parent.findOneAndUpdate(
      { Email: Email },
      {
        $set: {
          Password: nouveauMdpEncrypted
        }
      }
    )
  
    res.send({ parent })
  },
  motDePasseOublie: async (req, res) => {
    const codeDeReinit = req.body.codeDeReinit
    const parent = await Parent.findOne({ "Email": req.body.Email })
    if (parent) {
      // token creation
      const token = jwt.sign({ Email: parent.Email }, "SECRET");
  
      envoyerEmailReinitialisation(req.body.Email, codeDeReinit)
  
      res.status(200).send({ "message": "L'email de reinitialisation a été envoyé a " + parent.Email })
    } else {
      res.status(404).send({ "message": "Utilisateur innexistant" })
    }
  },
  
   
  SigninwithSocialmedia: async (req, res) => {

    const { Email, Name } = req.body
  
    if (Email === "") {
      res.status(403).send({ message: "error please provide an email" })
    } else {
      var parent = await Parent.findOne({ Email })
      if (parent) {
        console.log("user exists, loging in")
        res.status(201).send({ message: "success", parent })
      } 
      else {
        console.log("user does not exists, creating an account")
  
        theparent = new Parent()
  
        theparent.Name = Name
        theparent.Email = Email
        theparent.Password = null
        console.log(theparent)
        theparent.save()
        res.status(201).send({ message: "success", "parent":theparent })
      } 
      // token creation not available yet
      
    }
  }
  
};
async function envoyerEmailReinitialisation (Email, codeDeReinit) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thegooutapp@gmail.com',
      pass: 'goout1234'
    }
  })

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error)
      console.log("Server not ready")
    } else {
      console.log("Server is ready to take our messages")
    }
  })

  const mailOptions = {
    from: 'Gooutapp',
    to: Email,
    subject: 'Reinitialisation de votre mot de passe ',
    html: "<h3>Vous avez envoyé une requete de reinitialisation de mot de passe </h3><p>Entrez ce code dans l'application pour proceder : <b style='color : blue'>" + codeDeReinit + "</b></p>"
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent : ' + info.response)
    }
  })
}