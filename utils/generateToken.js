import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    console.log("Generating token for ID:", id);
    console.log("JWT_SECRET_KEY used for signing (first 3):", process.env.JWT_SECRET_KEY?.substring(0, 3));
    console.log("JWT_SECRET_KEY length:", process.env.JWT_SECRET_KEY?.length);
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' })
}

export default generateToken