module.exports = (app) => {

  app.use((req, res, next) => {
    // this middleware runs whenever requested page is not available
    res.status(404).json({ errorMessages: "This route does not exist" })
  })

  app.use((err, req, res, next) => {
    // whenever you call next(err), this middleware will handle the error
    // always logs the error
    console.error("ERROR", req.method, req.path, err)

    // only render if the error ocurred before sending the response
    if (err.code && err.code === 11000) {
      res.status(409).json({ errorMessages: ['El registro ya se encuentra en la base de datos'] })
    }

    if (err.name === 'ValidationError') {
      let errorMessages = Object.values(err.errors).map(el => el.message)
      res.status(400).json({ errorMessages })
    }

    if (!res.headersSent) {
      res
        .status(500)
        .json({
          errorMessages: "Internal server error. Check the server console",
        })
    }
  })
}
