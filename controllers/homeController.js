const MainBanner = require('../models/Home/MainBanner')  
const cloudinaryUpload = require('../utils/cloudinaryUpload')

class HomeController {
    async getMainBanner (req, res) {
        try {
            const MainBannerObj = await MainBanner.find({})

            if (MainBanner) {
                res.status(200).json({status: 'success', data: MainBannerObj[0]})
            } else {
                res.status(400).json({status: 'error', message: 'MainBanner not found!'})
            }
            
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async createMainBannerSliderItems (req, res) {
        try {
            const { slides, banners } = req.body
            const files = req.files

            // Images genetaror
            function * imagesGeneratorFunction (images) {
                yield * images
            }

            const MainBannerObj = await MainBanner.findOne({})

            if (!MainBannerObj) {
                await MainBanner.create({})
            }


            if (slides){
                const parsedSlides = JSON.parse(slides)
                const images = await cloudinaryUpload.uploadFiles(files, 'main_slides')
                const imagesGenerator = imagesGeneratorFunction(images)
    
                const slidesLoop = async () => { 
                    let updaitedSlidesArr = []
                    const promises = await parsedSlides.map(async (slide) => {
                        // If slide already exist
                        if (slide._id) {
                            // console.log('have _id')
                            
                            // const targetElementIndex = MainBannerObj.slides.findIndex((item) => {
                            //     return item._id == slide._id
                            // })

                            // const targetElement = MainBannerObj.slides[targetElementIndex]

                            // targetElement.title = slide.title
                            // targetElement.subtitle = slide.subtitle
                            // targetElement.link = slide.link

                            // if (slide.changeImage) {
                            //     targetElement.image = imagesGenerator.next().value
                            // } else {
                            //     targetElement.image = slide.image
                            // }

                            const slideObj = {
                                _id: slide._id,
                                title: slide.title,
                                subtitle: slide.subtitle,
                                link: slide.link,
                                image: ''
                            }

                            if (slide.changeImage) {
                                slideObj.image = imagesGenerator.next().value
                            } else {
                                slideObj.image = slide.image
                            }

                            updaitedSlidesArr.push(slideObj)


                        // If slide new and without image
                        } else if (slide.image != undefined){
                            // console.log('dont have _id')
                            // MainBannerObj.slides.push({title: slide.title, subtitle: slide.subtitle, link: slide.link, image: imagesGenerator.next().value})

                            updaitedSlidesArr.push({title: slide.title, subtitle: slide.subtitle, link: slide.link, image: imagesGenerator.next().value})
                        } else {
                            console.log('else')
                            // MainBannerObj.slides.push({title: slide.title, subtitle: slide.subtitle, link: slide.link, image: null})
                            updaitedSlidesArr.push({title: slide.title, subtitle: slide.subtitle, link: slide.link, image: null})
                        }

                        // MainBannerObj.slides = updaitedSlidesArr
        
                    })
    
                    await Promise.all(promises)
                    MainBannerObj.slides = updaitedSlidesArr
                    await MainBannerObj.save()
                }
                
                
    
                slidesLoop()
            } else if (banners) {
                const parsedBanners = JSON.parse(banners)
                const images = await cloudinaryUpload.uploadFiles(files, 'main_banners')
                const imagesGenerator = imagesGeneratorFunction(images)

                const bannersLoop = async () => { 
                    let updaitedBannersArr = []

                    const promises = await parsedBanners.map(async (banner) => {
                        // If slide already exist
                        if (banner._id) {
                            const bannerObj = {
                                _id: banner._id,
                                title: banner.title,
                                subtitle: banner.subtitle,
                                link: banner.link,
                                image: ''
                            }

                            if (banner.changeImage) {
                                bannerObj.image = imagesGenerator.next().value
                            } else {
                                bannerObj.image = banner.image
                            }

                            updaitedBannersArr.push(bannerObj)
                        } else {
                            const bannerObj = {
                                title: banner.title,
                                subtitle: banner.subtitle,
                                link: banner.link,
                                image: ''
                            }

                            if (banner.changeImage) {
                                bannerObj.image = imagesGenerator.next().value
                            } else {
                                bannerObj.image = banner.image
                            }

                            updaitedBannersArr.push(bannerObj)
                        }
        
                    })
    
                    await Promise.all(promises)
                    MainBannerObj.banners = updaitedBannersArr
                    await MainBannerObj.save()
                }
                
                
    
                bannersLoop()
            }

            res.status(200).json({status: 'success', data: MainBannerObj})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async getPostById (req, res) {
        try {
            const { id } = req.params
            
            if(!id) {
                res.status(400).send()
            }

            const blogPost = await BlogChema.findById(id)
            
            res.status(200).json({status: 'success', data: blogPost})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async createBlogPost (req, res) {
        try {
            const blogPostRes = req.body
            const cloudinaryResp = await cloudinaryUpload.uploadFile(req.file, 'blog')

            const data = {
                ...blogPostRes,
                image: cloudinaryResp.url, 
            }

            const newBlogPost = await BlogChema.create(data)

            res.status(200).json({status: 'success', data: newBlogPost})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async updateBlogPost (req, res) {
        try {
            const { title, description, category, status, url } = req.body
            const { id } = req.params
            let cloudinaryImageUrl = ''

            if(!id) {
                res.status(400).send()
            }
            
            const blogPost = await BlogChema.findById(id)

            if(req.file){
                const { url } = await cloudinaryUpload.uploadFile(req.file, 'blog')
                cloudinaryImageUrl = url
            }

            if (blogPost) {
                blogPost.title = title
                blogPost.description = description
                blogPost.category = category
                blogPost.status = status
                url ? blogPost.image = url : blogPost.image = cloudinaryImageUrl
                blogPost.save()


                res.status(200).json({status: 'success', data: blogPost})
            } else {
                res.status(400).json({status: 'error', message: 'Post not found!'})
            }
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async deleteBlogPost (req, res) {
        try {
            const { id } = req.params

            if(!id) {
                res.status(400).send()
            }
            
            const blogPost = await BlogChema.findById(id)
            if(!blogPost) {
                res.status(400).json({status: 'error', message: 'Post not found!'})
            }
            blogPost.deleteOne()

            res.status(200).json({status: 'success', message: 'Post deleted!'})

        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async getBlogCategories (req, res) {
        try {
            const BlogCategories = await BlogCategoryChema.find({})
            
            res.status(200).json({status: 'success', data: BlogCategories})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async createBlogCategory (req, res) {
        try {
            const { name } = req.body

            console.log(req.body)
            const blogCatObj = {
                title: name,
                name: name,
            }
            // console.log(blogCatObj)

            const blogCategory = await BlogCategoryChema.create(blogCatObj)
            
            res.status(200).json({status: 'success', data: blogCategory})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async updateBlogCategory (req, res) {
        try {
            const { name } = req.body
            const { id } = req.params

            if(!id) {
                res.status(400).send()
            }

            const blogCatObj = {
                title: name,
                name: name,
            }

            const blogCategory = await BlogCategoryChema.findByIdAndUpdate(id, blogCatObj)
            
            if(!blogCategory) {
                res.status(400).json({status: 'error', message: 'Blog Category not found!'})
            }

            res.status(200).json({status: 'success', data: blogCategory})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async deleteBlogCategory (req, res) {
        try {
            const { id } = req.params

            if(!id) {
                res.status(400).send()
            }
            
            const blogCategory = await BlogCategoryChema.findById(id)
            if(!blogCategory) {
                res.status(400).json({status: 'error', message: 'Blog Category not found!'})
            }
            blogCategory.deleteOne()

            res.status(200).json({status: 'success', message: 'Blog Category deleted!'})

        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

}

module.exports = new HomeController()