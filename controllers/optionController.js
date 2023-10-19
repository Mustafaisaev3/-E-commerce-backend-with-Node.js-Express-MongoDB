const Option = require("../models/Option/Option")
const OptionValue = require("../models/Option/OptionValue")
const cloudinaryUpload = require('../utils/cloudinaryUpload')

class OptionsController {
    async fetchOptions (req, res) {
        try {
            const options = await Option.find({})

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
                        // const newOptionValue = await OptionValue.create({value: option.value, image: imagesGenerator.next().value})
                        newOption.values.push({value: option.value, title: option.value, image: imagesGenerator.next().value})
                        // return newOptionValue
                    } else {
                        // const newOptionValue = await OptionValue.create({value: option.value, image: null})
                        newOption.values.push({value: option.value, title: option.value, image: null})
                        // return newOptionValue
                    }
    
                })

                await Promise.all(promises)
                await newOption.save()
            }

            // const optionsLoop = async () => { 
            //     const promises = await options.map(async (option) => {
            //         if(option.image != undefined){
            //             const newOptionValue = await OptionValue.create({value: option.value, image: imagesGenerator.next().value})
            //             newOption.optionValues.push(newOptionValue)
            //             return newOptionValue
            //         } else {
            //             const newOptionValue = await OptionValue.create({value: option.value, image: null})
            //             newOption.optionValues.push(newOptionValue)
            //             return newOptionValue
            //         }
    
            //     })

            //     await Promise.all(promises)
            //     await newOption.save()
            // }

            optionsLoop()

            res.status(201).json({status: 'success', data: newOption})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }

    async updateOption (req, res) {
        try {
            const { option } = req.body
            const files = req.files

            console.log(option, 'option')

            const {id, name, options} = JSON.parse(option)

            let optionItem = await Option.findById(id)

            if(!optionItem) {
                res.status(404).json({status: 'error', message: 'Option not found'})
            }

            const optionsLoop = async () => { 
                optionItem.values = []
                const promises = await options.map(async (option) => {
                    if(option.image != undefined){
                        optionItem.values.push({value: option.value, title: option.value, image: imagesGenerator.next().value})
                    } else {
                        optionItem.values.push({value: option.value, title: option.value, image: null})
                    }
    
                })

                await Promise.all(promises)
                await optionItem.save()
            }

            optionsLoop()

            res.status(201).json({status: 'success', data: optionItem})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }
    
    async deleteOption (req, res) {
        try {
            const { id } = req.params

            console.log(id)
            const option = await Option.findById('643b499ae6e7266ca7ba8a13')

            if(!option) {
                res.status(404).json({status: 'error', message: 'Option not found'})
            }

            // option.optionValues.map((value) => {
            //     console.log(value)
            // })
            
            res.status(200).json({message: 'OK'})
        } catch (error) {
            res.status(400).json({status: 'error', message: error.message})
        }
    }


}

module.exports = new OptionsController()
