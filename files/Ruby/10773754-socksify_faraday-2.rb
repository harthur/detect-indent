# requires socksify gem
require "socksify"
require 'socksify/http'

# use w/ OAuth2 like OAuth2::Client.new(id, secret, connection_opts: { proxy: 'socks://127.0.0.1:9050' })
class Faraday::Adapter::NetHttp
  def net_http_connection(env)
    if proxy = env[:request][:proxy]
      if proxy[:uri].scheme == 'socks'
        Net::HTTP.SOCKSProxy(proxy[:uri].host, proxy[:uri].port)
      else
        Net::HTTP::Proxy(proxy[:uri].host, proxy[:uri].port, proxy[:user], proxy[:password])
      end
    else
      Net::HTTP
    end.new(env[:url].host, env[:url].port)
  end
end