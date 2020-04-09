const mongoose = require("mongoose");
const crypto   = require("crypto");
const Schema = mongoose.Schema;

const GoogleAuthScheme = new Schema({
    google_id: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});

const FBAuthScheme = new Schema({
    fb_id: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});

const UserScheme = new Schema({
    token: {
        type: String,
        required: true
    },
    public_token: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        default: "other"
    },
    date_birth: {
        type: String,
        default: "01.01.1970"
    },
    health_status: {
        type: String,
        default: "ok" 
    },
    stats: {
        clear: {
            type: Number,
            default: 1
        },
        passing: {
            type: Number,
            default: 0
        },
        sustained: {
            type: Number,
            default: 0
        },
        alert: {
            type: Number,
            default: 0
        },
        last_update: {
            type: Number,
            default: 0
        },
        last_covid: {
            type: Number,
            default: 0
        },
        last_medium: {
            type: Number,
            default: 0
        }
    }
});

function connect(url) {
    return mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log('Connected to mongodb!')
    });
};

function newUser() {
    return User({
        token: crypto.randomBytes(16).toString('hex'),
        public_token: parseInt(crypto.randomBytes(4).toString('hex'), 16)
    });
}

const GoogleAuth = mongoose.model("GoogleAuth", GoogleAuthScheme);
const FBAuth     = mongoose.model("FBAuth", FBAuthScheme);
const User       = mongoose.model("User", UserScheme);

module.exports.GoogleAuth = GoogleAuth;
module.exports.FBAuth     = FBAuth;
module.exports.User       = User;

module.exports.connect    = connect;
module.exports.newUser    = newUser;