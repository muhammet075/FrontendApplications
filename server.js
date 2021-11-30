const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = process.env.PORT || 5000;
const fetch = require("node-fetch");

app.use(express.static("public"));

app.use("/css", express.static(__dirname + "public.css"));
app.use("/js", express.static(__dirname + "public.js"));

app.use(expressLayouts);
app.set("layout", "./layouts/formaat");
app.set("view engine", "ejs");

app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/grafiek", handleApi, (req, res) => {
  res.render("grafiek");
});

app.get("/plaatsen", handleSteden, (req, res) => {
  res.render("plaatsen");
});

app.get("/svgoefening", (req, res) => {
  res.render("svgoefening");
});

app.get("/favorietdatums", (req, res) => {
  res.render("favorietdatums");
});

app.get("/automerken", (req, res) => {
  res.render("automerken");
});

app.get("/datumsverschonen", (req, res) => {
  res.render("datumsverschonen");
});

app.get("/huisdiernamen", (req, res) => {
  res.render("huisdiernamen");
});

async function handleSteden(req, res) {
  const stedenApi = await fetch(
    "https://countriesnow.space/api/v0.1/countries/"
  )
    .then((res) => res.json())
    .then((json) => {
      let stedenData = json.data[150].cities;

      console.log(stedenData);

      let stedenArray = [];

      for (let i = 0; i < stedenData.length; i++) {
        stedenArray.push(stedenData[i]);
      }

      console.log(stedenArray);

      res.render("plaatsen", {
        stedenArray: stedenArray,
      });
    });
}

async function handleApi(req, res) {
  const landenApi = await fetch(
    "https://countriesnow.space/api/v0.1/countries/population"
  )
    .then((res) => res.json())
    .then((json) => {
      var nieuwData = json.data[185].populationCounts;

      let inwoners = [];

      for (let i = 0; i < nieuwData.length; i++) {
        //afronden naar 3 getallen
        var afronden = nieuwData[i].value.toString().slice(0, -4);

        //een komma toevoegen na de miljoen getal
        var decimalen = afronden.slice(0, 2) + "." + afronden.slice(2);

        //string omzetten naar int
        var nieuwInwoner = Number(decimalen);

        //pushen naar nieuwe array
        inwoners.push(nieuwInwoner);
      }

      res.render("grafiek", {
        nieuwData: nieuwData,
        inwoners: inwoners,
      });
    });
}

app.listen(port, () => {
  console.log("Server aan");
});
