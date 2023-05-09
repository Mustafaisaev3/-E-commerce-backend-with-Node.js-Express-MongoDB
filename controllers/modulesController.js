const MainBanner = require('../models/Modules/MainBanner') 
const Slider = require('../models/Modules/Slider') 
const Banners = require('../models/Modules/Banners') 
const cloudinaryUpload = require('../utils/cloudinaryUpload')

class ModulesController {

    // Main Banner 

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

    // Main Banner 

    // Slider

    async getSliders (req, res) {
        try {

            const Sliders = await Slider.find({ name: { $ne: 'Blog Slider' } } ).populate({
                path: 'items',
                model: 'Product'
            })

            res.status(201).json({status: 'success', data: Sliders})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async newSlider (req, res) {
        try {
            const sliderRes = req.body

            const newSlider = await Slider.create(sliderRes)

            res.status(201).json({status: 'success', data: newSlider})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }
    
    async updateSlider (req, res) {
        try {
            const sliderRes = req.body
            const { id } = req.params

            if(!id) {
                res.status(400).send()
            }

            const updatedSlider = await Slider.findByIdAndUpdate(id, sliderRes).populate({
                path: 'items',
                model: 'Product'
            })

            console.log(sliderRes)

            if(!updatedSlider) {
                res.status(404).json({status: 'error', message: 'Slider not Found'})
            } else {
                res.status(201).json({status: 'success', data: updatedSlider})
            }

        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async deleteSlider (req, res) {
        console.log('delete')
        try {
            const { id } = req.params

            if(!id) {
                res.status(400).send()
            }

            const slider = await Slider.findById(id).populate({
                path: 'items',
                model: 'Product'
            })

            if(!slider) {
                res.status(404).json({status: 'error', message: 'Slider not found'})
            }

            await slider.deleteOne()

            res.status(201).json({status: 'success', message: 'Slider deleted!'})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    // Slider


    // Popular Categories

    async getPopularCategories (req, res) {
        try {

            const PopularCategories = await Banners.findOne({title: 'Popular Categories'})

            res.status(201).json({status: 'success', data: PopularCategories})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async createPopularCategories (req, res) {
        try {
            const {banner} = req.body
            const files = req.files
            const parsedBanner = JSON.parse(banner)

            // Images genetaror
            function * imagesGeneratorFunction (images) {
                yield * images
            }

            const BannerObj = await Banners.findOne({title: 'Popular Categories'})

            if (!BannerObj) {
                await Banners.create({title: 'Popular Categories', link: parsedBanner.link, status: parsedBanner.status})
            }


            const images = await cloudinaryUpload.uploadFiles(files, 'popular_categories')
            const imagesGenerator = imagesGeneratorFunction(images)

            const bannerItemsLoop = async () => { 
                let updaitedBannerItemsArr = []
                const promises = await parsedBanner.items.map(async (item) => {
                    // If slide already exist
                    if (item._id) {

                        const bannerItemObj = {
                            _id: item._id,
                            title: item.title,
                            subtitle: item.subtitle,
                            link: item.link,
                            image: ''
                        }

                        if (item.changeImage) {
                            bannerItemObj.image = imagesGenerator.next().value
                        } else {
                            bannerItemObj.image = item.image
                        }

                        updaitedBannerItemsArr.push(bannerItemObj)


                    // If slide new and without image
                    } else if (item.image != undefined){
                        updaitedBannerItemsArr.push({title: item.title, subtitle: item.subtitle, link: item.link, image: imagesGenerator.next().value})
                    } else {              
                        updaitedBannerItemsArr.push({title: item.title, subtitle: item.subtitle, link: item.link, image: null})
                    }
    
                })

                await Promise.all(promises)
                BannerObj.items = updaitedBannerItemsArr
                await BannerObj.save()
            }
            
            

            bannerItemsLoop()

            res.status(200).json({status: 'success', data: BannerObj})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }
    

    // Popular Categories


    // Triple Banner

    async getTripleBanner (req, res) {
        try {

            const TripleBanner = await Banners.findOne({title: 'Triple Banner'})

            res.status(201).json({status: 'success', data: TripleBanner})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async createTripleBanner (req, res) {
        try {
            const { banner } = req.body
            const files = req.files
            const parsedBanner = JSON.parse(banner)

            // Images genetaror
            function * imagesGeneratorFunction (images) {
                yield * images
            }

            const TripleBannerObj = await Banners.findOne({title: 'Triple Banner'})

            if (!TripleBannerObj) {
                await Banners.create({title: 'Triple Banner', link: parsedBanner.link, status: parsedBanner.status})
            }


            const images = await cloudinaryUpload.uploadFiles(files, 'triple_banner')
            const imagesGenerator = imagesGeneratorFunction(images)

            const bannerItemsLoop = async () => { 
                let updaitedBannerItemsArr = []
                const promises = await parsedBanner.items.map(async (item) => {
                    // If slide already exist
                    if (item._id) {

                        const bannerItemObj = {
                            _id: item._id,
                            title: item.title,
                            subtitle: item.subtitle,
                            link: item.link,
                            image: ''
                        }

                        if (item.changeImage) {
                            bannerItemObj.image = imagesGenerator.next().value
                        } else {
                            bannerItemObj.image = item.image
                        }

                        updaitedBannerItemsArr.push(bannerItemObj)


                    // If slide new and without image
                    } else if (item.image != undefined){
                        updaitedBannerItemsArr.push({title: item.title, subtitle: item.subtitle, link: item.link, image: imagesGenerator.next().value})
                    } else {              
                        updaitedBannerItemsArr.push({title: item.title, subtitle: item.subtitle, link: item.link, image: null})
                    }
    
                })

                await Promise.all(promises)
                TripleBannerObj.items = updaitedBannerItemsArr
                await TripleBannerObj.save()
            }
            
            

            bannerItemsLoop()

            res.status(200).json({status: 'success', data: TripleBannerObj})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }
    

    // Triple Banner

    // Brands

    async getBrands (req, res) {
        try {

            const Brands = await Banners.findOne({title: 'Brands'})

            res.status(201).json({status: 'success', data: Brands})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async createBrands (req, res) {
        try {
            const { brands_banner } = req.body
            const files = req.files
            const parsedBrands = await JSON.parse(brands_banner)
            console.log(parsedBrands)

            // Images genetaror
            function * imagesGeneratorFunction (images) {
                yield * images
            }

            const BrandsObj = await Banners.findOne({title: 'Brands'})

            if (!BrandsObj) {
                await Banners.create({title: 'Brands', link: parsedBrands.link, status: parsedBrands.status})
            }


            const images = await cloudinaryUpload.uploadFiles(files, 'brands')
            const imagesGenerator = imagesGeneratorFunction(images)

            const brandsItemsLoop = async () => { 
                let updaitedBrandsItemsArr = []
                const promises = await parsedBrands.items.map(async (item) => {
                    // If slide already exist
                    if (item._id) {

                        const brandItemObj = {
                            _id: item._id,
                            title: item.title,
                            subtitle: item.subtitle,
                            link: item.link,
                            image: ''
                        }

                        if (item.changeImage) {
                            brandItemObj.image = imagesGenerator.next().value
                        } else {
                            brandItemObj.image = item.image
                        }

                        updaitedBrandsItemsArr.push(brandItemObj)


                    // If slide new and without image
                    } else if (item.image != undefined){
                        updaitedBrandsItemsArr.push({title: item.title, subtitle: item.subtitle, link: item.link, image: imagesGenerator.next().value})
                    } else {              
                        updaitedBrandsItemsArr.push({title: item.title, subtitle: item.subtitle, link: item.link, image: null})
                    }
    
                })

                await Promise.all(promises)
                BrandsObj.items = updaitedBrandsItemsArr
                await BrandsObj.save()
            }
            
            

            brandsItemsLoop()

            res.status(200).json({status: 'success', data: BrandsObj})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }
    

    // Brands

    // Blog Slider

    async getBlogSlider (req, res) {
        try {

            const Posts = await Slider.findOne({name: 'Blog Slider'}).populate({
                path: 'items',
                model: 'Blog'
            })
            

            res.status(201).json({status: 'success', data: Posts})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }
    
    async updateBlogSlider (req, res) {
        try {
            const sliderRes = req.body
            

            const targetSlider = await Slider.findOne({name: 'Blog Slider'})

            if(!targetSlider) {
                const newSlider = await Slider.create(sliderRes)
                res.status(201).json({status: 'success', data: newSlider})
            } else {
                const updatedSlider = await Slider.findOneAndUpdate({name: 'Blog Slider'}, sliderRes).populate({
                    path: 'items',
                    model: 'Blog'
                })
                res.status(201).json({status: 'success', data: updatedSlider})
            }

        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }


    // Blog Slider

    

}

module.exports = new ModulesController()