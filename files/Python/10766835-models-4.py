class Permission(models.Model):

    """Permisos de usuarios para empresas."""

    code_name = models.CharField(verbose_name=u'codigo', max_length='255')
    name = models.CharField(verbose_name=u'nombre', max_length='255')

    class Meta:
        ordering = ['code_name']
        verbose_name = u'permiso'
        verbose_name_plural = u'permisos'

    def __unicode__(self):
        return self.code_name


class Group(models.Model):

    """Grupo de usuarios para empresas."""

    name = models.CharField(verbose_name=u'nombre', max_length='255')
    enterprise = models.ForeignKey(Enterprise, verbose_name=u'empresa')
    permissions = models.ManyToManyField(Permission, verbose_name=u'permisos')

    class Meta:
        ordering = ['name']
        verbose_name = u'grupo'
        verbose_name_plural = u'grupos'

    def __unicode__(self):
        return self.name