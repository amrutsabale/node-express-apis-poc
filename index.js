/*
Ref: https://youtu.be/pKd0Rpw7O48
*/

const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "Course 1" },
  { id: 2, name: "Course 2" },
  { id: 3, name: "Course 3" },
];

//demo api routes
app.get("/", (req, res) => {
  res.send("hello world!");
});

//main apis

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).send("Course not found");
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  const { erorr } = schema.validate(req.body);
  if (erorr) {
    // Bad request
    return res.status(400).send(erorr.details[0].message);
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/course/:id", (req, res) => {
  // look up for course
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).send("Course not found");

  // validate
  const schema = Joi.object({ name: Joi.string().min(3).required() });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // update course
  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/course/:id", (req, res) => {
  // look up for course
  const course = courses.find((c) => c.id === Number(req.params.id));
  if (!course) return res.status(404).send("Course not found");

  // delete course
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on Port ${port}`));
