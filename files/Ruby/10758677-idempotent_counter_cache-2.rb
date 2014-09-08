module IdempotentCounterCache
  module BuilderExtension

    def add_counter_cache_callbacks(reflection)
      super
      cache_column = reflection.counter_cache_column
      foreign_key = reflection.foreign_key

      # This skip_callback do not work... may be related to https://github.com/rails/rails/issues/12571
      # model.skip_callback(:destroy, :before, "belongs_to_counter_cache_before_destroy_for_#{name}")

      mixin.class_eval <<-CODE, __FILE__, __LINE__ + 1
        def belongs_to_counter_cache_before_destroy_for_#{name}
          # NOOP
        end
      
        def belongs_to_counter_cache_after_destroy_for_#{name}
          unless destroyed_by_association && destroyed_by_association.foreign_key.to_sym == #{foreign_key.to_sym.inspect}
            record = #{name}
            if record && @_deleted_records_count.to_i > 0
              record.class.decrement_counter(:#{cache_column}, record.id)
            end
          end
        end
      CODE

      model.after_destroy "belongs_to_counter_cache_after_destroy_for_#{name}".to_sym
      model.after_commit :clear_deleted_records_count
      model.after_rollback :clear_deleted_records_count
    end

  end

  module ModelExtension

    private

    def destroy_row
      @_deleted_records_count = super
    end

    def clear_deleted_records_count
      @_deleted_records_count = nil
    end

  end

end

ActiveRecord::Associations::Builder::BelongsTo.send(:prepend, IdempotentCounterCache::BuilderExtension)
ActiveRecord::Base.send(:include, IdempotentCounterCache::ModelExtension)
