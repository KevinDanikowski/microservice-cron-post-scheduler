const SocialPost = `
type Image {
    id: String
    url: String
}
type SocialPost {
    id: String
    GCID: String
    message: String
    image: Image
}
input ImageInput {
    url: String
}
input SocialPostInput {
    GCID: String
    message: String
    image: ImageInput
}`

export default () => [SocialPost]