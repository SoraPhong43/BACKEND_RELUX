const getHomepage = (req, res) => {
  //process data
  //call modules
  res.status(200).send("hello world");
};
const getABC = (req, res) => {
  res.send("hello world2");
};
const phong = (req, res) => {
  res.render("sample.ejs");
};

module.exports = {
  getHomepage,
  getABC,
  phong,
};
