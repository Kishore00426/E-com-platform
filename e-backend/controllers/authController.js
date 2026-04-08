import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabaseClient.js';


const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// --- REGISTER (Updated for Admin Secret) ---
export const registerUser = async (req, res) => {
    const { name, username, email, password, address, contact, adminSecret } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if they provided the correct Admin Secret
        const isCreatingAdmin = adminSecret === process.env.ADMIN_SECRET;

        const { data, error } = await supabase
            .from('users')
            .insert([{ 
                full_name: name, 
                username, 
                email, 
                password: hashedPassword, 
                address, 
                contact,
                role: isCreatingAdmin ? 'admin' : 'user',
                is_approved: isCreatingAdmin ? true : false // Admins are auto-approved!
            }])
            .select();

        if (error) throw error;
        
        const message = isCreatingAdmin 
            ? "Admin registered successfully! You can log in now." 
            : "Registration successful! Waiting for admin approval.";

        res.status(201).json({ message, user: data[0] });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// --- LOGIN (Unified: Email or Username) ---
export const loginUser = async (req, res) => {
    const { identifier, password } = req.body; // 'identifier' can be email OR username

    try {
        // 1. Find user by email OR username
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .or(`email.eq.${identifier},username.eq.${identifier}`)
            .single();

        if (error || !user) return res.status(400).json({ error: "Invalid credentials" });

        // 2. Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // 3. Check for admin approval if they are a standard user
        if (user.role === 'user' && !user.is_approved) {
            return res.status(403).json({ error: "Account pending admin approval." });
        }

        // 4. Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        
        res.json({ token, user: { id: user.id, name: user.full_name, role: user.role, email: user.email, address: user.address, contact: user.contact } });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- UPDATE PROFILE (Name, Email, Password) ---
export const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { name, email, password, address, contact } = req.body;

    try {
        const updateData = {};
        if (name) updateData.full_name = name;
        if (email) updateData.email = email;
        if (address) updateData.address = address;
        if (contact) updateData.contact = contact;
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        // Return updated user (excluding password)
        const updatedUser = {
            id: data.id,
            name: data.full_name,
            email: data.email,
            role: data.role,
            address: data.address,
            contact: data.contact
        };

        res.json({ message: "Profile updated successfully!", user: updatedUser });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
