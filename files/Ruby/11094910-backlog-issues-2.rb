#!/usr/bin/env ruby
require 'highline/import'
require 'xmlrpc/client'

space_id = ENV['BACKLOG_SPACE_ID'] || HighLine.ask('Backlog space id:')
user_id = ENV['BACKLOG_USER_ID'] || HighLine.ask('Backlog user id:')
password = ENV['BACKLOG_PASSWORD'] || HighLine.ask('Backlog password:') {|q| q.echo = false}

class NulabBacklog
  PREFIX = 'backlog'

  def initialize(space_id, user_id, password)
    @user_id = user_id
    @client = XMLRPC::Client.new2("https://#{@user_id}:#{password}@#{space_id}.backlog.jp/XML-RPC")
  end

  def user(disable_cache=false)
    @user = nil if disable_cache
    @user ||= @client.call("#{PREFIX}.getUser", @user_id)
  end

  def projects(disable_cache=false)
    @projects = nil if disable_cache
    @projects ||= @client.call("#{PREFIX}.getProjects")
  end

  def issues(disable_cache=false)
    @issues = nil if disable_cache
    issues = {}
    projects.each do |project|
      issues[project['key']] = @client.call("#{PREFIX}.findIssue", projectId: project['id'], statusId: [1, 2, 3], assignerId: user['id'], sort: 'DUE_DATE')
    end
    @issues = issues
  end
end

backlog = NulabBacklog.new(space_id, user_id, password)
$stderr.puts "Loading #{backlog.user['name']}'s issues..."
issues = backlog.issues.map {|_, issues| issues}.flatten
url_width = issues.map {|i| i['url'].length}.max
issues.sort_by {|i| i['due_date']}.each do |issue|
  due_date = if issue['due_date'].empty?
               '(N/A)  '
             else
               date = Date.parse(issue['due_date'])
               "(%02d/%02d)" % [date.month, date.day]
             end
  puts [due_date, issue['url'].ljust(url_width), issue['summary']].join(' ')
end
