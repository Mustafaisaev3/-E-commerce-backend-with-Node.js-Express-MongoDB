const MainBanner = require('../models/Modules/MainBanner') 
const Slider = require('../models/Modules/Slider') 
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

            const Sliders = await Slider.find({}).populate({
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

}

module.exports = new ModulesController()