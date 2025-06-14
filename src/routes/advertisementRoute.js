import express from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../public/temp/adduploads');
        fs.mkdir(dir, { recursive: true }, (err) => {
            if (err) {
                return cb(err);
            }
            cb(null, dir);
        });
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.post('/', upload.array('files'), async (req, res) => {
    try {
        const { name, email, phone, discription } = req.body;

        if (!name || !email || !phone || !discription ) {
            return res.status(400).json({ message: 'Please fill in all fields and upload at least one file.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.RES_EMAIL) {
            return res.status(500).json({ message: 'Email configuration is missing.' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RES_EMAIL,
            subject: `New Advertisement by ${name}`,
            html: `
                <h2>New Advertisement Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Advertisement Discription:</strong><br>${discription}</p>
            `,
            attachments: req.files.map(file => ({
                filename: file.filename,
                path: file.path,
            })),
        };

        let transporter;
        try {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
            console.log('Email transporter created successfully');
        } catch (err) {
            console.error('Error creating transporter:', err);
            return res.status(500).json({ message: 'Failed to configure email transporter.' });
        }

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);

            req.files.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log(`File deleted: ${file.path}`);
                    }
                });
            });

            res.status(200).json({ message: 'Contribution submitted successfully.' });
        } catch (err) {
            console.error('Error sending email:', err);
            res.status(500).json({ message: 'Failed to send contribution email.' });
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
});

export default router;
