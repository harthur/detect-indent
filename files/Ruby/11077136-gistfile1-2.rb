# user_id = '522d3cf8a57cbb890f000005'
# send_invites(user_id, secret: 'android', desc: '郑州见面会专用。', welcome: '感谢您使用收留我App。')
# send_invites(user_id, { secret: 'android', limit: 50 }, 2)
def send_invites(user_id, opts={}, num=1)
  u = User.find(user_id)
  return false if u.nil?
  opts.symbolize_keys!
  return false if opts[:secret].nil?
  1.upto(num) { |i| 
    u.invites.create(
         secret: opts[:secret],
           desc: opts[:desc] || '',
        welcome: opts[:welcome] || '',
           code: opts[:code],
          limit: opts[:limit] || 1,
     started_at: opts[:started_at] || Time.now,
     expired_at: opts[:expired_at],
    )
  }
  true
end