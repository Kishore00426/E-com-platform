import supabase from '../config/supabaseClient.js';

const defaultAboutData = {
    title: "About Products House",
    subtitle: "Your premier destination for quality products and everyday essentials.",
    heroImage: "https://images.unsplash.com/photo-1534452286302-2f5630b90487?auto=format&fit=crop&q=80&w=1200",
    sections: [
        {
            id: "mission",
            title: "Our Mission",
            content: "At Products House, our mission is simple: to bring high-quality, curated products directly to your doorstep with unmatched convenience and care. We believe that every purchase should be an experience of 'freshly brewed happiness.'",
            icon: "rocket"
        },
        {
            id: "story",
            title: "The Story",
            content: "What started as a small passion for finding unique, reliable products has grown into a thriving community. We carefully select each item in our collection, ensuring it meets our high standards for durability, style, and value.",
            icon: "book"
        },
        {
            id: "values",
            title: "Our Values",
            content: "Quality first, customer second to none. We pride ourselves on transparent sourcing, prompt delivery, and a support team that actually listens.",
            icon: "heart"
        }
    ],
    team: [
        { name: "John Doe", role: "Founder & CEO" },
        { name: "Jane Smith", role: "Head of Curation" },
        { name: "Alex Johnson", role: "Logistics Lead" }
    ]
};

export const getAboutPageData = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'about_page_data')
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is row not found
            throw error;
        }

        if (data && data.value) {
            let parsedData = data.value;
            // Supabase returns JSON directly if the column type is JSONB, otherwise it might be a string.
            if (typeof parsedData === 'string') {
                try {
                    parsedData = JSON.parse(parsedData);
                } catch (e) {
                    console.error("Error parsing about data:", e);
                }
            }
            return res.json(parsedData);
        }

        // Return default if not found
        res.json(defaultAboutData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPrivacyPolicy = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'privacy_policy')
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        if (data && data.value) {
            return res.json({ content: data.value });
        }

        // Return default if not found
        res.json({ content: "Your privacy is our priority. We do not share your data." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTermsCondition = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'terms_condition')
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        if (data && data.value) {
            return res.json({ content: data.value });
        }

        // Return default if not found
        res.json({ content: "These are the default terms and conditions." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
