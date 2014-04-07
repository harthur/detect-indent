// MoSQL can be dumb sometimes, especially when it comes to discerning values
{
  where: { created_at: { $gt: 'now()' } }
}
// => where created_at > $1

// Boof! That doesn't work. What about the non-parameterized value approach?
{
  where: { created_at: { $gt: '$now()$' } }
}
// => where created_at > "now()"

// Boof! Also doesn't work. So what do you do?
// Create your own damn helper is what you do:
mosql.registerConditionalHelper(
  '$is_future'
, { cascade: false }
, function( column, value, values, table, query ){
    return [
      mosql.quoteObject( column, table )
    , value ? '>' : '<'
    , 'now()'
    ].join('');
  }
);

{
  where: { created_at: { $is_future: true } }
}
// => where created_at > now()

// Success!