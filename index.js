const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { error } = require('winston');
const port = 3333;
const app = express();
app.use(cors());
app.use(express.json());


(async function configureDB() {   //fe
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/course-april25');
        console.log('connected to db');
    } catch (err) {
        console.log('error connecting to db', err.message);
    }
})();
// configureDB();
//creating a schema - blueprint
const { Schema, model } = mongoose;

const instructorSchema = new Schema({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    expertise: {
        type: String,

    }
}, { timestamps: true });

//create a model
const Instructor = mongoose.model('Instructor', instructorSchema);

//course schema
const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'instructor'
    }
}, { timestamps: true });

// create the model
const Course = mongoose.model('Course', CourseSchema);

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    enrolledCourse: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Course'
    }
})
const Student = mongoose.model('Student', StudentSchema);
//set api
app.get('/api/instructors', async (req, res) => {
    try {
        const instructors = await Instructor.find();//model -> collection(convention over configuration)
        res.json(instructors);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'OOPS!! Something went wrong' });
    }
});

app.post('/api/instructors', async (req, res) => {
    const body = req.body;
    try {
        //const instructor = await Instructor.create(body);
        const instructorObj = new Instructor(body);
        await instructorObj.save();
        res.status(201).json(instructor);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong' });
    }
})

app.get('/api/instructors/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const instructor = await Instructor.findById(id);
        if (!instructor) {
            return res.status(404).json({});
        }
        res.json(instructor);
    } catch (err) {
        console.log(err);
        res.status(500).json({ json: 'something went wrong' });
    }
})

app.put('/api/instructors/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const instructor = await Instructor.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        // if (!instructor) {
        //     return res.status(404).json({});
        // }
        res.json(instructor);
    } catch (err) {
        console.log(err);
        res.json(500).json({ error: 'something went wrong' });
    }
})

app.delete('/api/instructors/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const instructor = await Instructor.findByIdAndDelete(id);
        if (!instructor) {
            return res.status(404).json({});
        }
        res.json(instructor);
    } catch (err) {
        console.log(err);
        res.json(500).json({ error: 'something went wrong!!!' });
    }
})

//set api for course
app.get('/api/coursedata', async (req, res) => {
    try {
        const coursedata = await Course.find();
        res.json(coursedata);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
});

app.post('/api/coursedata', async (req, res) => {
    const body = req.body;
    try {
        const coursedata = await Course.create(body);
        if (!coursedata) {
            res.status(404).json({});
        }
        res.status(201).json(coursedata);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong!!!' });
    }
});

app.get('/api/coursedata/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const coursedata = await Course.findById(id);
        if (!coursedata) {
            res.status(404).json({});
        }
        res.json(coursedata);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong' });
    }
})

app.put('/api/coursedata/:id', async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    try {

        const coursedata = await Course.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        res.json(coursedata);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
});

app.delete('/api/coursedata/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const coursedata = await Course.findByIdAndDelete(id);
        if (!coursedata) {
            res.status(404).json({});
        }
        res.json(coursedata);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
})

//set api for students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();//model -> collection(convention over configuration)
        res.json(students);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'OOPS!! Something went wrong' });
    }
});

app.post('/api/students', async (req, res) => {
    const body = req.body;
    try {
        const students = await Student.create(body);
        res.status(201).json(students);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong' });
    }
})

app.get('/api/students/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const students = await Student.findById(id);
        if (!students) {
            return res.status(404).json({});
        }
        res.json(students);
    } catch (err) {
        console.log(err);
        res.status(500).json({ json: 'something went wrong' });
    }
})

app.put('/api/students/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const students = await Student.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        // if (!instructor) {
        //     return res.status(404).json({});
        // }
        res.json(students);
    } catch (err) {
        console.log(err);
        res.json(500).json({ error: 'something went wrong' });
    }
})

app.delete('/api/students/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const students = await Student.findByIdAndDelete(id);
        if (!students) {
            return res.status(404).json({});
        }
        res.json(students);
    } catch (err) {
        console.log(err);
        res.json(500).json({ error: 'something went wrong!!!' });
    }
})

app.listen(port, () => {
    console.log('server running on port', port);
});