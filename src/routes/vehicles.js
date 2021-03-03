const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicle');
const { isAuthenticated } = require('../helpers/auth');

router.get ('/vehicles/add', isAuthenticated, async (req, res) => {
    //res.sendFile(path.join(__dirname, 'views/Index.html'));
    const vehicles = await Vehicle.find().lean();
    res.render('vehicles/new-vehicle', {vehicles});

});

router.post ('/vehicles/new-vehicle', isAuthenticated,  async (req, res)=>{

    const{placas, description} = req.body;
    const errors = [];
    if (!placas){
        errors.push({text: 'Ingresa las placas de tu vehículo'});
    }
    if (!description){
        errors.push({text: 'Ingresa una descripcion'}); 
    }
    if (errors.length > 0){
        res.render('vehicles/new-vehicle',{
            errors,
            placas,
            description
        });
    }
    else {
        const newvehicle = new Vehicle({placas, description});
        newvehicle.user = req.user._id;
        console.log(req.user._id);
        await newvehicle.save();
        req.flash('success_msg', 'Vehículo agregado exitosamente');
        res.redirect('/vehicles');
    }
        //res.send('ok');
});

router.get('/vehicles', isAuthenticated,  async (req, res) => {
  const vehicles = await Vehicle.find({user: req.user._id}).sort({date: 'desc'}).lean();
  res.render('vehicles/all-vehicles', {vehicles});
});
/*
router.get('/notes', isAuthenticated,  async (req, res) => {
    await vehicle.find({user: req.user.id}).sort({date: 'desc'})
      .then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {
                _id: documento.id,
                title: documento.title,
                description: documento.description
            }
          })
        }
        res.render('notes/all-notes', { notes: contexto.notes }) 
      })
  });
*/

router.get('/vehicles/edit/:id', isAuthenticated, async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id).lean();
   
    res.render('vehicles/edit-vehicle', {vehicle});
}); 

router.put('/vehicles/edit-vehicle/:id', isAuthenticated, async (req, res) => {
    const {placas, description} = req.body;
    await Vehicle.findByIdAndUpdate(req.params.id, {placas, description});
    req.flash('success_msg', 'Actualizado correctamente');
    res.redirect('/vehicles');
});

router.delete('/vehicles/delete/:id', isAuthenticated, async (req, res) => {
    await Vehicle.findByIdAndDelete(req.params.id).lean();
    req.flash('success_msg', 'Eliminado correctamente');
    res.redirect('/vehicles');
});
/*
router.get('/notes/edit/:id', async (req, res) => {
    await vehicle.findById(req.params.id)
      .then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {
                _id: documento.id,
                title: documento.title,
                description: documento.description
            }
          })
        }
        res.render('notes/edit-vehicle', { notes: contexto.notes }) 
      })
  });

  router.put('/notes/edit-vehicle/:id', async (req, res) =>{
    const {title, description} = req.body;
    await vehicle.findByIdAndUpdate(req.params.id, {description})
    .then(documentos => {
      const contexto = {
          notes: documentos.map(documento => {
          return {
            _id: documento.id,
              title: documento.title,
              description: documento.description
          }
        })
      }
    })
    res.redirect('/notes');
  });

*/

module.exports = router;