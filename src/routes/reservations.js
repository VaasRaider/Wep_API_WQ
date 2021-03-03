const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Note = require('../models/Note');
const Vehicle = require('../models/vehicle');
const { isAuthenticated } = require('../helpers/auth');

router.get ('/reservations/add', isAuthenticated, async (req, res) => {
    //res.sendFile(path.join(__dirname, 'views/Index.html'));
    const notes = await Note.find().lean();
    const vehicles = await Vehicle.find({user: req.user._id}).lean();
   console.log(vehicles);
    res.render('reservations/new-reservation', {notes, vehicles });

});

router.post ('/reservations/new-reservation', isAuthenticated,  async (req, res)=>{

    const{_id, input_date, park_name, user, park_id} = req.body;
    const errors = [];
    if (!input_date){
        errors.push({text: 'Ingresa la fecha y hora de tu reservación'});
    }
    if (!park_name){
        errors.push({text: 'Ingresa un estacionamiento'}); 
    }
    if (errors.length > 0){
      
      const notes = await Note.find().lean();
        res.render('reservations/new-reservation',{
            errors,
            input_date,
            user,
            park_name, 
            notes
        });
        
   // console.log(notes);
    //res.render('reservations/new-reservation', {notes});
    }
    else {
        const status = 'reservado';
        const newreservation = new Reservation({input_date, status, park_name, user, park_id});
        newreservation.user = req.user._id;
        console.log(req.user._id);
        await newreservation.save();
        req.flash('success_msg', 'Reservación agregada exitosamente');
        res.redirect('/reservations');
    }
        //res.send('ok');
});

router.get('/reservations', isAuthenticated,  async (req, res) => {
  const reservations = await Reservation.find({user: req.user._id}).sort({input_date: 'desc'}).lean();
  res.render('reservations/all-reservations', {reservations});
});
/*
router.get('/notes', isAuthenticated,  async (req, res) => {
    await reservation.find({user: req.user.id}).sort({date: 'desc'})
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

router.get('/reservations/edit/:id', isAuthenticated, async (req, res) => {
    const reservation = await Reservation.findById(req.params.id).lean();
   
    res.render('reservations/edit-reservation', {reservation});
}); 

router.put('/reservations/edit-reservation/:id', isAuthenticated, async (req, res) => {
    const {placas, description} = req.body;
    await Reservation.findByIdAndUpdate(req.params.id, {placas, description});
    req.flash('success_msg', 'Actualizado correctamente');
    res.redirect('/reservations');
});

router.delete('/reservations/delete/:id', isAuthenticated, async (req, res) => {
    await Reservation.findByIdAndDelete(req.params.id).lean();
    req.flash('success_msg', 'Eliminado correctamente');
    res.redirect('/reservations');
});
/*
router.get('/notes/edit/:id', async (req, res) => {
    await reservation.findById(req.params.id)
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
        res.render('notes/edit-reservation', { notes: contexto.notes }) 
      })
  });

  router.put('/notes/edit-reservation/:id', async (req, res) =>{
    const {title, description} = req.body;
    await reservation.findByIdAndUpdate(req.params.id, {description})
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