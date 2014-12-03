var test = require('tape');
/*
we want to include these files for use:
*/


/*******************************************************************************
*
*   Set up the angular objects
*
*******************************************************************************/



/*******************************************************************************
*
*   Make sure the angular setup is all kosher
*
*******************************************************************************/


test('Everything OK, Angular? Want to talk about it?', function(t){

  t.ok(angular, 'Angular: "Yes, I\'m OK. I don\'t want to talk about it."');
  t.end();

});

test('Are you sure? (ngmock)', function(t){

  t.ok(angular, 'Angular: "It\'s fine..."');
  t.end();

});

test('Can you take me places? (routes)', function(t){
  t.equals(0,0);
  t.end();
});
