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
}`

export default () => [SocialPost]