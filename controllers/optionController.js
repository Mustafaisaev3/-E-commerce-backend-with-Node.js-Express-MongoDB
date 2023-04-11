const Option = require("../models/Option/Option")
const OptionValue = require("../models/Option/OptionValue")
const cloudinaryUpload = require('../utils/cloudinaryUpload')

class OptionsController {
    async fetchOptions (req, res) {
        try {
            const options = await Option.find({}).populate('optionValues')

            res.status(200).json({status: 'success', data: options})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async newOption (req, res) {
        try {
            const { option } = req.body
            const files = req.files

            const {name, options} = JSON.parse(option)

            const images = await cloudinaryUpload.uploadFiles(files, 'options')

            // Images genetaror
            function * imagesGeneratorFunction () {
                yield * images
            }
            const imagesGenerator = imagesGeneratorFunction()

            const newOption = await Option.create({title: name})

            // options.map(async (option) => {
            //     if(option.image != undefined){
            //         const newOptionValue = await OptionValue.create({value: option.value, image: imagesGenerator.next().value})
            //         await newOption.optionValues.push(newOptionValue)
            //     } else {
            //         const newOptionValue = await OptionValue.create({value: option.value, image: null})
            //         await newOption.optionValues.push(newOptionValue)
            //     }

            //     await newOption.save()
            // })


            const optionsLoop = async () => { 
                const promises = await options.map(async (option) => {
                    if(option.image != undefined){
                        const newOptionValue = await OptionValue.create({value: option.value, image: imagesGenerator.next().value})
                        newOption.optionValues.push(newOptionValue)
                        return newOptionValue
                    } else {
                        const newOptionValue = await OptionValue.create({value: option.value, image: null})
                        newOption.optionValues.push(newOptionValue)
                        return newOptionValue
                    }
    
                })

                await Promise.all(promises)
                await newOption.save()
            }

            optionsLoop()

            // for(let i = 0; i < options.length ; i++){
            //     const optionObj = {value: options[i].value, image: options[i].image == undefined ? undefined : images[i]}
            //     const newOption = await OptionValue.create()
            // }
            // optionObj.map((option) => {

            // })
            

            // const data = {
            //     ...productRes,
            //     name: productRes.title,
            //     images, 
            // }
            
            // const newProduct = await Product.create(data)

            res.status(201).json({status: 'success', data: newOption})
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }


}

module.exports = new OptionsController()
