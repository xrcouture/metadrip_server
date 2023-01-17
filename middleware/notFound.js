const notFound = (req, res) => {
  console.error(
    `The ${req.method} method on the url: ${req.url} does not exists`
  );
  res.status(404).send("Route does not exist");
};

module.exports = notFound;
